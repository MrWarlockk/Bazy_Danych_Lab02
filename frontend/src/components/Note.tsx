type NoteProps = {
  id: number;
  title: string;
  text: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  image?: string;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Note({
  id,
  title,
  text,
  tags,
  createdAt,
  updatedAt,
  image,
  onDelete,
  onEdit,
}: NoteProps) {
  return (
    <div className="note">
      <div className="noteHeader">
        <h2>{title}</h2>
      </div>

      {image && (
        <div className="noteImage">
          <img src={image} alt="attachment" />
        </div>
      )}

      <div className="noteText">{text}</div>

      <div className="noteTags">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            #{tag}
          </span>
        ))}
      </div>

      <div className="noteInfo">
        <small>Utworzono: {formatDate(createdAt)}</small>
        <small>Edytowano: {formatDate(updatedAt)}</small>
      </div>

      <div className="noteFooter">
        <button className="noteEdit" onClick={() => onEdit(id)}>
          Edytuj
        </button>

        <button className="noteRemove" onClick={() => onDelete(id)}>
          Usuń
        </button>
      </div>
    </div>
  );
}
