"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PrivateHeader from "@/components/PrivateHeader";
import { supabase } from "@/lib/supabase";
import { clearAccessCookies } from "@/lib/auth";
import {
  ShieldCheck,
  Users,
  KeyRound,
  LogOut,
  RefreshCcw,
  UserRound,
  BadgeCheck,
  AlertTriangle,
  UserPlus,
} from "lucide-react";

function formatDate(value) {
  if (!value) return "No disponible";

  try {
    return new Intl.DateTimeFormat("es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "No disponible";
  }
}

function SourceBadge({ label, active }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
        active
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-slate-100 text-slate-500"
      }`}
    >
      {label}
    </span>
  );
}

function AdminKeyBadge({ keyKind }) {
  const label =
    keyKind === "secret"
      ? "Supabase Secret Key"
      : keyKind === "service_role"
      ? "Supabase Service Role"
      : "Sin clave privilegiada";

  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
      {label}
    </span>
  );
}

async function authenticatedFetch(url, accessToken, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Error inesperado");
  }

  return payload;
}

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditEntries, setAuditEntries] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [managementMessage, setManagementMessage] = useState("");
  const [managementEnabled, setManagementEnabled] = useState(true);
  const [busyUserId, setBusyUserId] = useState("");
  const [keyKind, setKeyKind] = useState(null);
  const [sourceOfTruth, setSourceOfTruth] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [createUserForm, setCreateUserForm] = useState({
    email: "",
    password: "",
    role: "user",
    plan: "starter",
    active: true,
    emailConfirm: true,
  });

  const loadAdminData = useCallback(async (currentSession, { silent = false } = {}) => {
    const accessToken = currentSession?.access_token;

    if (!accessToken) {
      router.replace("/login?redirect=/admin");
      return;
    }

    if (silent) {
      setReloading(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [mePayload, usersPayload, auditPayload] = await Promise.all([
        authenticatedFetch("/api/admin/me", accessToken),
        authenticatedFetch("/api/admin/users", accessToken),
        authenticatedFetch("/api/admin/audit", accessToken),
      ]);

      setAdmin(mePayload.admin);
      setKeyKind(mePayload.adminKeyKind || usersPayload.keyKind || null);
      setUsers(usersPayload.users || []);
      setAuditEntries(auditPayload.entries || []);
      setManagementEnabled(usersPayload.managementEnabled !== false);
      setManagementMessage(usersPayload.message || "");
      setSourceOfTruth(usersPayload.sourceOfTruth || null);
    } catch (fetchError) {
      if (String(fetchError.message).includes("administradores")) {
        router.replace("/dashboard");
        return;
      }

      setError(fetchError.message || "No se pudo cargar la zona admin.");
    } finally {
      setLoading(false);
      setReloading(false);
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      setSession(currentSession);

      if (!currentSession) {
        router.replace("/login?redirect=/admin");
        return;
      }

      await loadAdminData(currentSession);
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [loadAdminData, router]);

  async function refreshUsers() {
    setInfoMessage("");
    await loadAdminData(session, { silent: true });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    clearAccessCookies();
    window.location.href = "/login";
  }

  async function updateUser(userId, patch) {
    if (!session?.access_token) return;

    setBusyUserId(userId);
    setInfoMessage("");
    setError("");

    try {
      const payload = await authenticatedFetch(
        `/api/admin/users/${userId}`,
        session.access_token,
        {
          method: "PATCH",
          body: JSON.stringify(patch),
        }
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) => (user.id === userId ? payload.user : user))
      );

      setSelectedUser((currentSelectedUser) =>
        currentSelectedUser?.id === userId ? payload.user : currentSelectedUser
      );

      setInfoMessage("Cambio administrativo aplicado correctamente.");
      await loadAdminData(session, { silent: true });
    } catch (updateError) {
      setError(updateError.message || "No se pudo actualizar el usuario.");
    } finally {
      setBusyUserId("");
    }
  }

  async function sendPasswordReset(user) {
    if (!session?.access_token || !user?.email) return;

    setBusyUserId(user.id);
    setInfoMessage("");
    setError("");

    try {
      await authenticatedFetch(
        `/api/admin/users/${user.id}/reset-password`,
        session.access_token,
        {
          method: "POST",
          body: JSON.stringify({ email: user.email }),
        }
      );

      setInfoMessage(`Reset de contraseña enviado a ${user.email}.`);
    } catch (resetError) {
      setError(
        resetError.message || "No se pudo enviar el reset de contraseña."
      );
    } finally {
      setBusyUserId("");
    }
  }

  async function createUser() {
    if (!session?.access_token) return;

    setBusyUserId("create");
    setInfoMessage("");
    setError("");

    try {
      const payload = await authenticatedFetch(
        "/api/admin/users",
        session.access_token,
        {
          method: "POST",
          body: JSON.stringify(createUserForm),
        }
      );

      setCreateUserForm({
        email: "",
        password: "",
        role: "user",
        plan: "starter",
        active: true,
        emailConfirm: true,
      });
      setSelectedUser(payload.user);
      setInfoMessage(`Usuario creado: ${payload.user.email}`);
      await loadAdminData(session, { silent: true });
    } catch (createError) {
      setError(createError.message || "No se pudo crear el usuario.");
    } finally {
      setBusyUserId("");
    }
  }

  async function handleAdminPasswordChange(event) {
    event.preventDefault();
    setPasswordMessage("");
    setError("");

    if (!passwordForm.password || passwordForm.password.length < 8) {
      setPasswordMessage("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (passwordForm.password !== passwordForm.confirmPassword) {
      setPasswordMessage("Las contraseñas no coinciden.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordForm.password,
    });

    if (updateError) {
      setPasswordMessage(updateError.message);
      return;
    }

    setPasswordForm({ password: "", confirmPassword: "" });
    setPasswordMessage("Contraseña actualizada correctamente.");
  }

  const stats = useMemo(() => {
    const activeUsers = users.filter((user) => user.active).length;
    const adminUsers = users.filter((user) => user.role === "admin").length;

    return {
      total: users.length,
      active: activeUsers,
      inactive: users.length - activeUsers,
      admins: adminUsers,
    };
  }, [users]);

  return (
    <>
      <PrivateHeader />

      <main className="min-h-screen bg-slate-50 text-slate-800">
        <section className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  <ShieldCheck className="w-4 h-4" />
                  SmartWorkIA Admin
                </div>
                <AdminKeyBadge keyKind={keyKind} />
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-tight">
                Administración interna
              </h1>
              <p className="mt-3 max-w-3xl text-slate-300 leading-relaxed">
                Controla usuarios, planes, accesos y permisos desde una zona separada del dashboard operativo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={refreshUsers}
                disabled={reloading || loading}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-bold hover:bg-white/10 transition-colors disabled:opacity-60"
              >
                <RefreshCcw className={`w-4 h-4 ${reloading ? "animate-spin" : ""}`} />
                Actualizar
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {(error || infoMessage || managementMessage || passwordMessage) && (
            <div className="space-y-3">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 font-medium">
                  {error}
                </div>
              )}
              {infoMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 font-medium">
                  {infoMessage}
                </div>
              )}
              {managementMessage && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800 font-medium">
                  {managementMessage}
                </div>
              )}
              {!error && passwordMessage && (
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-700 font-medium">
                  {passwordMessage}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { label: "Usuarios", value: stats.total, icon: Users },
              { label: "Activos", value: stats.active, icon: BadgeCheck },
              { label: "Inactivos", value: stats.inactive, icon: AlertTriangle },
              { label: "Admins", value: stats.admins, icon: ShieldCheck },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                    {item.label}
                  </span>
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="mt-5 text-4xl font-black text-slate-900">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {sourceOfTruth && (
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">
                Fuente de verdad y sincronización
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Role</div>
                  <div className="mt-2 font-bold text-slate-900">{sourceOfTruth.role}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Plan</div>
                  <div className="mt-2 font-bold text-slate-900">{sourceOfTruth.plan}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Active</div>
                  <div className="mt-2 font-bold text-slate-900">{sourceOfTruth.active}</div>
                </div>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_2fr] gap-8">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <UserRound className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Admin actual
                  </h2>
                  <p className="text-slate-500">
                    Datos del usuario administrador conectado.
                  </p>
                </div>
              </div>

              {loading ? (
                <p className="text-slate-500">Cargando datos del administrador...</p>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-2">
                    <div className="text-sm text-slate-500">Email</div>
                    <div className="font-bold text-slate-900">{admin?.email || "No disponible"}</div>
                    <div className="text-sm text-slate-500">Rol</div>
                    <div className="font-bold text-slate-900">{admin?.role || "user"}</div>
                    <div className="text-sm text-slate-500">Plan</div>
                    <div className="font-bold text-slate-900">{admin?.plan || "starter"}</div>
                    <div className="text-sm text-slate-500">Alta</div>
                    <div className="font-bold text-slate-900">{formatDate(admin?.createdAt)}</div>
                  </div>

                  <form onSubmit={handleAdminPasswordChange} className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-black">
                      <KeyRound className="w-4 h-4 text-blue-600" />
                      Cambiar contraseña
                    </div>

                    <input
                      type="password"
                      value={passwordForm.password}
                      onChange={(event) =>
                        setPasswordForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      placeholder="Nueva contraseña"
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
                    />
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({
                          ...current,
                          confirmPassword: event.target.value,
                        }))
                      }
                      placeholder="Confirmar nueva contraseña"
                      className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
                    />

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white font-bold hover:bg-slate-800 transition-colors"
                    >
                      Guardar contraseña
                    </button>
                  </form>
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Gestión de usuarios
                  </h2>
                  <p className="text-slate-500">
                    Lista de usuarios, plan actual, acceso y detalle.
                  </p>
                </div>
                {!managementEnabled && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
                    Configuración parcial
                  </span>
                )}
              </div>

              {loading ? (
                <p className="text-slate-500">Cargando usuarios...</p>
              ) : users.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-slate-500">
                  No se han encontrado usuarios administrables con la configuración actual.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1120px]">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="pb-4 pr-4">Usuario</th>
                        <th className="pb-4 pr-4">Plan</th>
                        <th className="pb-4 pr-4">Estado</th>
                        <th className="pb-4 pr-4">Rol</th>
                        <th className="pb-4 pr-4">Fuentes</th>
                        <th className="pb-4 pr-4">Creación</th>
                        <th className="pb-4 pr-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t border-slate-100 align-top">
                          <td className="py-4 pr-4">
                            <div className="font-bold text-slate-900">{user.email || "Sin email"}</div>
                            <div className="text-xs text-slate-500 mt-1 break-all">{user.id}</div>
                          </td>
                          <td className="py-4 pr-4">
                            <select
                              value={user.plan}
                              disabled={!managementEnabled || busyUserId === user.id}
                              onChange={(event) =>
                                updateUser(user.id, { plan: event.target.value })
                              }
                              className="h-11 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-900 disabled:opacity-60"
                            >
                              <option value="starter">starter</option>
                              <option value="pro">pro</option>
                              <option value="enterprise">enterprise</option>
                            </select>
                          </td>
                          <td className="py-4 pr-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                                user.active
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {user.active ? "Activo" : "Inactivo"}
                            </span>
                            <div className="mt-2 text-xs text-slate-500">
                              {user.active ? "Sin bloqueo activo" : "Bloqueado / baneado"}
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <select
                              value={user.role}
                              disabled={!managementEnabled || busyUserId === user.id}
                              onChange={(event) =>
                                updateUser(user.id, { role: event.target.value })
                              }
                              className="h-11 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-900 disabled:opacity-60"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                          <td className="py-4 pr-4">
                            <div className="flex flex-wrap gap-2">
                              <SourceBadge label="Auth" active={user.availability?.auth} />
                              <SourceBadge label="Profiles" active={user.availability?.profile} />
                            </div>
                            <div className="mt-2 text-xs text-slate-500 space-y-1">
                              <div>role: {user.sources?.role}</div>
                              <div>plan: {user.sources?.plan}</div>
                              <div>active: {user.sources?.active}</div>
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-sm text-slate-600">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="py-4 pr-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => updateUser(user.id, { active: !user.active })}
                                disabled={!managementEnabled || busyUserId === user.id}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-60"
                              >
                                {user.active ? "Desactivar" : "Activar"}
                              </button>
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                              >
                                Ver detalle
                              </button>
                              <button
                                onClick={() => sendPasswordReset(user)}
                                disabled={busyUserId === user.id}
                                className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800 hover:bg-amber-100 transition-colors disabled:opacity-60"
                              >
                                Reset password
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Perfil / detalle de usuario
                </h2>
                <p className="text-slate-500">
                  Vista rápida del usuario seleccionado y bloque de soporte para password reset.
                </p>
              </div>
            </div>

            {!selectedUser ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-slate-500">
                Selecciona un usuario del listado para ver su detalle.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</div>
                      <div className="mt-2 font-bold text-slate-900 break-all">{selectedUser.email || "Sin email"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Rol</div>
                      <div className="mt-2 font-bold text-slate-900">{selectedUser.role}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Plan</div>
                      <div className="mt-2 font-bold text-slate-900">{selectedUser.plan}</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Estado</div>
                      <div className="mt-2 font-bold text-slate-900">{selectedUser.active ? "Activo" : "Inactivo"}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Fecha de creación</div>
                      <div className="mt-2 font-bold text-slate-900">{formatDate(selectedUser.createdAt)}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">ID</div>
                      <div className="mt-2 text-sm font-semibold text-slate-700 break-all">{selectedUser.id}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-lg font-black text-slate-900">Soporte de acceso</h3>
                  <p className="mt-2 text-slate-500 leading-relaxed">
                    Puedes enviar un reset de contraseña al usuario seleccionado. La gestión automática con Systeme.io queda pendiente para una siguiente integración.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => sendPasswordReset(selectedUser)}
                      disabled={busyUserId === selectedUser.id}
                      className="rounded-xl bg-slate-900 px-5 py-3 text-white font-bold hover:bg-slate-800 transition-colors disabled:opacity-60"
                    >
                      Enviar reset de contraseña
                    </button>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      Cerrar detalle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Crear usuario</h2>
                  <p className="text-slate-500">Alta manual en auth.users con rol, plan y estado inicial.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <input
                  type="email"
                  value={createUserForm.email}
                  onChange={(event) =>
                    setCreateUserForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="email@empresa.com"
                  className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
                />
                <input
                  type="password"
                  value={createUserForm.password}
                  onChange={(event) =>
                    setCreateUserForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Contraseña temporal"
                  className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    value={createUserForm.role}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        role: event.target.value,
                      }))
                    }
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-900"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <select
                    value={createUserForm.plan}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        plan: event.target.value,
                      }))
                    }
                    className="h-12 rounded-xl border border-slate-200 bg-white px-4 font-semibold text-slate-900"
                  >
                    <option value="starter">starter</option>
                    <option value="pro">pro</option>
                    <option value="enterprise">enterprise</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={createUserForm.active}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        active: event.target.checked,
                      }))
                    }
                  />
                  Usuario activo desde el alta
                </label>
                <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={createUserForm.emailConfirm}
                    onChange={(event) =>
                      setCreateUserForm((current) => ({
                        ...current,
                        emailConfirm: event.target.checked,
                      }))
                    }
                  />
                  Confirmar email al crear
                </label>
                <button
                  onClick={createUser}
                  disabled={!managementEnabled || busyUserId === "create"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white font-bold hover:bg-slate-800 transition-colors disabled:opacity-60"
                >
                  Crear usuario
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">Auditoría reciente</h2>
              <p className="mt-2 text-slate-500">Quién hizo qué, sobre qué usuario y cuándo.</p>

              <div className="mt-5 space-y-3">
                {auditEntries.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-slate-500">
                    Sin registros todavía o falta la tabla admin_audit_log.
                  </div>
                ) : (
                  auditEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="font-bold text-slate-900">{entry.action}</div>
                      <div className="mt-1 text-sm text-slate-600">
                        {entry.actor_email || "admin"} sobre {entry.target_email || entry.target_user_id}
                      </div>
                      <div className="mt-2 text-xs text-slate-500">{formatDate(entry.created_at)}</div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
