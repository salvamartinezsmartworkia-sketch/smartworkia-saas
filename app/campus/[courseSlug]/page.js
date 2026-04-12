import { notFound } from "next/navigation";
import AdminAreaGate from "@/components/AdminAreaGate";
import CampusCourseShell from "@/components/CampusCourseShell";
import {
  campusCourses,
  getCampusCourseBySlug,
} from "@/lib/campus-courses";

export function generateStaticParams() {
  return campusCourses.map((course) => ({
    courseSlug: course.slug,
  }));
}

export function generateMetadata({ params }) {
  const course = getCampusCourseBySlug(params.courseSlug);

  if (!course) {
    return {
      title: "Curso no encontrado | Campus SmartWorkIA",
    };
  }

  return {
    title: `${course.title} | Campus SmartWorkIA`,
    description: course.description,
  };
}

export default function CampusCoursePage({ params }) {
  const course = getCampusCourseBySlug(params.courseSlug);

  if (!course) {
    notFound();
  }

  return (
    <AdminAreaGate withHeader={false}>
      <CampusCourseShell course={course} />
    </AdminAreaGate>
  );
}
