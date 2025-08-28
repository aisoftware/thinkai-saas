interface Props {
  title: string;
  src: string;
}

export default function DocVideo({ title, src }: Props) {
  return (
    <div className="border-border h-full border-2 border-dashed">
      <iframe
        src={src}
        title={title ?? ""}
        frameBorder="0"
        loading="lazy"
        className="min-h-full w-full object-cover"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>
  );
}
