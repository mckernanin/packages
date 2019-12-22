import React from "react";
import TableCell from "@material-ui/core/TableCell";
import get from "lodash/get";

const Cell: React.FunctionComponent<{
  row: any;
  column: {
    accessor?: string;
    render?: (row: any) => React.ReactNode;
  };
}> = ({ row, column: { accessor, render } }) => {
  if (accessor) {
    return <TableCell>{get(row, accessor)}</TableCell>;
  }
  return <TableCell>{render && render(row)}</TableCell>;
};

export default Cell;
