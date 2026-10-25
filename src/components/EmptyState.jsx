export default function EmptyState({ titulo, as: Titulo = 'h2', children }) {
  return (
    <div className="empty">
      <img src="/img/robot.png" alt="" className="empty__robot" width="110" height="140" />
      <Titulo>{titulo}</Titulo>
      {children}
    </div>
  )
}