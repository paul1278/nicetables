/**
 * This is the main table class.
 */
class NiceTable {
  /**
   * Initializes the new table.
   * @param {number} cols Should be an integer, amount of cols.
   */
  constructor(cols = 1) {
    this.cols = cols;
    this.rows = [];
    this.dimensions = new Array(cols).fill(1 / cols);
    this.colWidths = [];
    this.titles = new Array(cols).fill("Col");
    this.calculateColWidths();
  }

  /**
   * Set the percentual dimensions of the table.
   * If this function is never called, each column will have equal width.
   * @param {...number} dimensions Percent (0.0-1.0). Must be lower than 1 when summed up.
   * @returns {NiceTable} instance.
   */
  setDimensions(...dimensions) {
    this.dimensions = dimensions;
    this.calculateColWidths();
    return this;
  }

  /**
   * This function recalculates the column widths based on the console screen.
   */
  calculateColWidths() {
    this.colWidths = [];
    let width = process.stdout.columns - this.cols - 1;
    let lastWidth = width;
    for (let i = 0; i < this.cols; i++) {
      if (i == this.cols - 1) {
        this.colWidths.push(lastWidth);
      } else {
        let w = Math.floor(this.dimensions[i] * width);
        lastWidth -= w;
        this.colWidths.push(w);
      }
    }
  }

  /**
   * Set the column titles.
   * @param {...string} titles All the titles, should be equal to the amount of colums.
   * @returns {NiceTable} instance.
   */
  setTitles(...titles) {
    this.titles = titles;
    return this;
  }

  /**
   * Add a new row with data to the table.
   * @param {...string} data An array of strings to add. Length should be equal to amount of colums.
   * @returns {NiceTable} instance.
   */
  addRow(...data) {
    this.rows.push(data);
    return this;
  }

  /**
   * Print the table finally.
   * @returns {NiceTable} instance.
   */
  print() {
    let rows = [...this.rows];
    this.printLine("=");
    this.printRow(this.titles);
    this.printLine("=");
    for (let i = 0; i < rows.length; i++) {
      this.printRow(rows[i]);
      this.printLine();
    }
    return this;
  }

  /**
   * Print one single line.
   * @param {string} icon The icon to use when writing out the line, defaults to '-'
   * @param {string} separator The icon to use when printing a separator.
   */
  printLine(icon = "-", separator = "+") {
    process.stdout.write("|");
    this.colWidths.forEach((w, i) => {
      process.stdout.write(
        icon.repeat(w) + (i == this.colWidths.length - 1 ? "|" : separator)
      );
    });
  }

  /**
   * Print one row of the table out.
   * @param {string[]} row An array of row-data.
   */
  printRow(row) {
    process.stdout.write("|");
    for (let j = 0; j < row.length; j++) {
      let colWidth = this.colWidths[j];
      let output = row[j];
      output = output.padEnd(colWidth, " ");
      process.stdout.write(output + "|");
    }
  }
}
