export default function ErrorText({ error }: { error: string }) {
  return (
    <div className="fixed bottom-0 w-full bg-[#1C9BEF] p-4 transition-opacity">
      <p>{error}</p>
    </div>
  );
}
