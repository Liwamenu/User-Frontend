const TableSkeleton = ({
  row = 8,
  headerClass = "h-8 ",
  rowClass = "h-14",
}) => {
  const rowNumbers = Array.from({ length: row }, (_, index) => index + 1);

  return (
    <div className="w-full text-sm font-light border border-solid border-[--border-1] rounded-lg overflow-hidden fade">
      <div>
        <div className={`bg-[--light-3] text-left ${headerClass}`}></div>
      </div>
      <div>
        {rowNumbers.map((i) => (
          <div
            key={i}
            className={`odd:bg-[--white-1] even:bg-[--table-odd] w-full border-b border-solid border-[--border-1] last:border-b-0 ${rowClass}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
