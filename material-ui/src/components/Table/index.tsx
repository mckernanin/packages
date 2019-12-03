import React from "react";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import CustomCell from "./Cell";

const styles = () =>
  createStyles({
    table: {
      minWidth: 700
    },
    wrapper: {
      maxWidth: "100%",
      overflowX: "scroll"
    }
  });

const CustomTable: React.FunctionComponent<
  WithStyles<typeof styles> & {
    data: Array<any>;
    columns: Array<{
      title: string;
      accessor?: string;
      render?: (row: any) => React.ReactNode;
    }>;
  }
> = ({ classes, data, columns }) => (
  <div className={classes.wrapper}>
    <Table className={classes.table} size="small">
      <TableHead>
        <TableRow>
          {columns.map(column => (
            <TableCell key={column.title}>{column.title}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.length > 0 ? (
          data.map(row => (
            <TableRow key={row.id}>
              {columns.map(column => (
                <CustomCell
                  key={`${row.id}-${column.title}`}
                  column={column}
                  row={row}
                />
              ))}
            </TableRow>
          ))
        ) : (
            <TableRow>
              <TableCell>There's nothing to show here.</TableCell>
            </TableRow>
          )}
      </TableBody>
    </Table>
  </div>
);

export default withStyles(styles)(CustomTable);
