alter table public.cargo_documents
  add column if not exists document_type text;

alter table public.cargo_documents
  drop constraint if exists cargo_documents_document_type_check;

alter table public.cargo_documents
  add constraint cargo_documents_document_type_check
  check (
    document_type is null
    or document_type in (
      'commercial_invoice',
      'packing_list',
      'transport_document',
      'customs_clearance',
      'certificate',
      'quote',
      'purchase_order',
      'proof',
      'other'
    )
  );
