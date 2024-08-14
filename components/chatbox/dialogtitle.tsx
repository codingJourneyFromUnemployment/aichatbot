

export default function DialogTitle({ title }) {

  return (
    <div className="mt-8 w-3/4">
      <h1 className="text-center text-sm  md:text-base text-primary/80">
        {title}
      </h1>
    </div>
  );
}