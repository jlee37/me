import MemoryEntryForm from "@/components/MemoryEntryForm";

export default function NewMenagerieEntryPage() {
  return (
    <div>
      <h1 className="text-2xl mb-8">New menagerie entry</h1>
      <MemoryEntryForm
        apiBase="/api/menagerie"
        backUrl="/admin/menagerie"
      />
    </div>
  );
}
