/**
 * This is the main table class.
 */
module.exports = class NiceTable {
  /**
   * Initializes the new table.
   */
  constructor() {
    this.cols = -1;
    this.rows = [];
    this.dimensions = [];
    this.colWidths = [];
    this.titles = [];
    this.linesPerRow = 2;
    this.fixedWidth = -1;
    this.outputWriter = (str) => process.stdout.write(str);
  }

  /**
   * Set the lines per row, after those lines the output will be trimmed.
   * @param {number} i must be a positive integer.
   * @returns {NiceTable} instance.
   */
  setLinesPerRow(i) {
    if (!Number.isInteger(i)) {
      throw new Error("LinesPerRow must be a positive integer");
    }
    if (i < 1) {
      throw new Error("LinesPerRow must be a positive integer");
    }
    this.linesPerRow = i;
    return this;
  }

  /**
   * Function to initialize all values of the table.
   */
  autoCalc() {
    this.cols = Math.max(...this.rows.map((r) => r.length));
    if (this.titles.length == 0) {
      this.titles = new Array(this.cols).fill("Col");
    } else if (this.titles.length < this.cols) {
      this.titles = [
        ...this.titles,
        ...new Array(this.cols - this.titles.length).fill("Col"),
      ];
    }
    if (this.dimensions.length == 0) {
      this.dimensions = new Array(this.cols).fill(1 / this.cols);
    } else if (this.dimensions.length < this.cols) {
      let left = 1 - this.dimensions.reduce((a, b) => a + b);
      this.dimensions = [
        ...this.dimensions,
        ...new Array(this.cols - this.dimensions.length).fill(
          left / (this.cols - this.dimensions.length)
        ),
      ];
    }
    this.calculateColWidths();
  }

  /**
   * Set the percentual dimensions of the table.
   * If this function is never called, each column will have equal width.
   * @param {...number} dimensions Percent (0.0-1.0). Must be lower than 1 when summed up.
   * @returns {NiceTable} instance.
   */
  setDimensions(...dimensions) {
    let goodDimensions = dimensions.filter((a) => typeof a === "number");
    if (dimensions.length > 0) {
    if (goodDimensions.reduce((a, b) => a + b) > 1) {
      throw new Error("All dimensions summed up must be lower or equal to 1");
    }
    }
    this.dimensions = goodDimensions;
    return this;
  }

  /**
   * This function recalculates the column widths based on the console screen.
   */
  calculateColWidths() {
    this.colWidths = [];
    let width;
    if (this.fixedWidth != -1) {
      width = this.fixedWidth - this.cols - 1;
    } else {
      width = process.stdout.columns - this.cols - 1;
    }
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
    let goodTitles = titles.map((title) => title + "");
    this.titles = goodTitles;
    return this;
  }

  /**
   * Add a new row with data to the table.
   * @param {...string} data An array of strings to add. Length should be equal to amount of colums.
   * @returns {NiceTable} instance.
   */
  addRow(...data) {
    this.rows.push(data.map((d) => d + ""));
    return this;
  }

  /**
   * Print the table finally.
   * @returns {NiceTable} instance.
   */
  print() {
    this.autoCalc();
    let rows = [...this.rows];
    this.printLine("=");
    this.printRow(this.titles);
    this.printLine("=");
    for (let i = 0; i < rows.length; i++) {
      let lines = 1;
      let next = this.printRow(rows[i], lines > this.linesPerRow - 1);
      while (next.length == 0 ? false : next.reduce((a, b) => a || b) != null) {
        next = this.printRow(next, lines >= this.linesPerRow - 1);
        lines++;
      }
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
    this.outputWriter("|");
    this.colWidths.forEach((w, i) => {
      this.outputWriter(
        icon.repeat(w) + (i == this.colWidths.length - 1 ? "|" : separator)
      );
    });
    this.outputWriter("\n");
  }

  /**
   * Print one row of the table out.
   * @param {string[]} row An array of row-data.
   * @param {boolean} trim Tells the function if the row should be trimmed.
   * @returns {string[]} The overflow-row if any.
   */
  printRow(row, trim = true) {
    this.outputWriter("|");
    let next = [];
    for (let j = 0; j < this.cols; j++) {
      let colWidth = this.colWidths[j];
      let output = row[j];
      if (output == null) {
        output = "";
      }
      if (output.length > colWidth) {
        if (trim) {
          output = output.substr(0, colWidth - 3) + "...";
          next.push(null);
        } else {
          next.push(output.substr(colWidth));
          output = output.substr(0, colWidth);
        }
      } else {
        next.push(null);
      }
      output = output.padEnd(colWidth, " ");
      this.outputWriter(output + "|");
    }
    this.outputWriter("\n");
    return next;
  }
};
