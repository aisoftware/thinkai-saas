interface Props {
  alt: string;
  src: string;
}

export default function DocTutorialImage({ alt, src }: Props) {
  return (
    <div className="border-border border-2 border-dashed">
      <img className="bg-secondary/90 mx-auto rounded-lg object-cover shadow-2xl" alt={alt} src={src} />
    </div>
  );
}
