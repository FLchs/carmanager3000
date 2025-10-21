function InfoCardItem({
  name,
  value,
}: {
  name: string;
  value?: null | number | string;
}) {
  return (
    <div>
      <dt className="text-text-muted">{name}</dt>
      <dd className="text-lg">{value}</dd>
    </div>
  );
}

export default InfoCardItem;
