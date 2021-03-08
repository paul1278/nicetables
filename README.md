# NiceTables
Simple to use table-printer for console-applications.

## Usage
Usage example with default dimensions (every column has the same width).

```js
const NiceTable = require("./lib/NiceTable");
const table = new NiceTable();
table.setTitles("Column #1", "Column #2");
table.addRow("data1", "data2");
table.addRow("data3", "data4", "data5");
table.print();
```
This will produce (fitted to your console width):
```
|===============+===============+================|
|Column #1      |Column #2      |Col             |
|===============+===============+================|
|data1          |data2          |                |
|---------------+---------------+----------------|
|data3          |data4          |data5           |
|---------------+---------------+----------------|
```

Another example with percentual dimensions:
```js
const NiceTable = require("./lib/NiceTable");
const table = new NiceTable();
table.setDimensions(0.25);
table.setTitles("Column #1", "Column #2");
table.addRow("data1", "data2");
table.addRow("data3", "data4", "data5");
table.print();
```
Will produce (fitted to your console-width):
```
|===========+=================+==================|
|Column #1  |Column #2        |Col               |
|===========+=================+==================|
|data1      |data2            |                  |
|-----------+-----------------+------------------|
|data3      |data4            |data5             |
|-----------+-----------------+------------------|
```

### Dimension calculation
With a call like `.setDimensions(0.25)`, you set the width of the first column to take up around 25% of the available space.
Because you did not specify anything for the other two columns, they will take half of the left space each.

With e.g. `.setDimensions(0.25, 0.5)` you could set the first column to 25%, the second to 50% and the third will get the missing 25%.

### Trimming
Sometimes the content is longer than the column. For that, you can set the multiline-trimming.
If you set e.g. `.setLinesPerRow(2)`, the output of a column will be trimmed after two lines:
```
|===============+===============+================|
|Column #1      |Column #2      |Col             |
|===============+===============+================|
|data1          |data2          |                |
|---------------+---------------+----------------|
|Lorem ipsum dol|data4          |data5           |
|or sit amet,...|               |                |
|---------------+---------------+----------------|
```
## API
### addRow(...data)
Adds a new row to the table. The total amount of colums is determined by the row with the most columns.

### print()
Prints out the table.

### setDimensions(...dimensions)
Sets the percentual dimensions of the table.

### setLinesPerRow(integer)
Sets the amount of lines to output per column in a row until it gets trimmed.

### setTitles(...titles)
Sets the titles of the table-columns. Because the columns are calculated based on the given data, you can enter as many titles as you want. If you enter fewer titles than there are columns, these columns will get the default title `Col`.

---

## License
MIT License

Copyright (c) 2021 Paul

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.