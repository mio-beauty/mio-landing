export default function SectionShell({ id, children }) {
  return (
    <section id={id} className="scroll-mt-28">
      {children}
    </section>
  )
}
