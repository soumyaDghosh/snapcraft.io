import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Input } from "@canonical/react-components";

function SnapsTableRow({
  storeName,
  storeId,
  snap,
  snapsCount,
  index,
  snapsToRemove,
  setSnapsToRemove,
  isOnlyViewer,
}) {
  const { id } = useParams();

  const [isChecked, setIsChecked] = useState(false);

  const tableCellClass = isOnlyViewer() ? "" : "table-cell--checkbox";

  const snapName =
    storeId === "ubuntu" ? (
      <a href={`https://snapcraft.io/${snap.name}`}>{snap.name}</a>
    ) : (
      snap.name || "-"
    );

  useEffect(() => {
    setIsChecked(
      snapsToRemove.find((item) => item.id === snap.id) ? true : false
    );
  }, [snapsToRemove]);

  return (
    <tr>
      {index === 0 ? (
        <td className="snap-published-in-cell" rowSpan={snapsCount}>
          {storeName}
        </td>
      ) : null}
      <td data-heading="Published in" className="u-hide-table-col--large">
        {storeName}
      </td>
      <td data-heading="Name" className={tableCellClass}>
        {storeId !== id && !snap.essential && !isOnlyViewer() ? (
          <Input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                setSnapsToRemove([].concat(snapsToRemove, [snap]));
              } else {
                setSnapsToRemove([
                  ...snapsToRemove.filter((item) => item.id !== snap.id),
                ]);
              }
            }}
            checked={isChecked}
            label={snapName}
          />
        ) : (
          <span style={{ marginLeft: "0.5rem" }}>{snapName}</span>
        )}
      </td>
      <td data-heading="Latest release">
        {snap["latest-release"].version ? snap["latest-release"].version : "-"}
      </td>
      <td data-heading="Release date">
        {format(new Date(snap["latest-release"].timestamp), "dd/MM/yyyy")}
      </td>
      <td data-heading="Publisher">{snap.users[0].displayname}</td>
    </tr>
  );
}

SnapsTableRow.propTypes = {
  storeName: PropTypes.string.isRequired,
  storeId: PropTypes.string.isRequired,
  snap: PropTypes.object.isRequired,
  snapsCount: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  snapsToRemove: PropTypes.array,
  setSnapsToRemove: PropTypes.func,
  isOnlyViewer: PropTypes.func.isRequired,
};

export default SnapsTableRow;