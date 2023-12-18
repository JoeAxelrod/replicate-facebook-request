import fs from 'fs';
import { Table } from 'console-table-printer';
import pkg from 'lodash';
const { get } = pkg;
const largeObject = JSON.parse(fs.readFileSync('www.facebook.com.har', 'utf8'));

const table = new Table({
  columns: [
    { name: 'count', alignment: 'right' },
    { name: 'path', alignment: 'left' },
    { name: 'occurrences', alignment: 'right' },
  ],
});

let count = 0;
function findPaths(obj, query, currentPath = '') {
    if (Array.isArray(obj)) {
        obj.forEach((item, index) => findPaths(item, query, `${currentPath}[${index}]`));
    } else if (obj && typeof obj === 'object') {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                findPaths(obj[key], query, currentPath ? `${currentPath}.${key}` : key);
            }
        }
    } else if (typeof obj === 'string') {
        // Attempt to JSON parse the string
        try {
            const parsedObj = JSON.parse(obj);
            // If parsing is successful, continue the recursion
            findPaths(parsedObj, query, currentPath);
        } catch (e) {
            // If parsing fails, check if the string contains the query
            if (obj.includes(query)) {
                const occurrences = obj.split(query).length - 1;
                table.addRow({ count: ++count, path: currentPath, occurrences: occurrences });
            }
        }
    }
}


findPaths(largeObject, 'ProfileCometHeaderQuery');
table.printTable();


// ┌───────┬───────────────────────────────────────────────────┬─────────────┐
// │ count │ path                                              │ occurrences │
// ├───────┼───────────────────────────────────────────────────┼─────────────┤
// │     1 │ log.entries[25].request.postData.text             │           1 │
// │     2 │ log.entries[25].request.postData.params[0].value  │           1 │
// │     3 │ log.entries[25].response.content.text             │           1 │
// │     4 │ log.entries[30].response.content.text             │          11 │
// │     5 │ log.entries[38].request.headers[29].value         │           1 │
// │     6 │ log.entries[38].request.postData.text             │           1 │
// │     7 │ log.entries[38].request.postData.params[20].value │           1 │
// │     8 │ log.entries[38].response.content.text             │           2 │
// └───────┴───────────────────────────────────────────────────┴─────────────┘

// console.log(JSON.parse(get(largeObject, 'log.entries[38].response.content.text')))



function customLog(output) {
    if (typeof output === 'string' && output.length > 300) {
        console.log(output.substring(0, 300) + '...');
    } else {
        console.log(output);
    }
}



customLog('All about 25:')
customLog(get(largeObject, 'log.entries[25].request'))
customLog(get(largeObject, 'log.entries[25].request.postData'))
customLog(get(largeObject, 'log.entries[25].request.postData.text'))
customLog('-----------------\n')


customLog('All about 30:')
customLog(get(largeObject, 'log.entries[30].response'))
customLog(get(largeObject, 'log.entries[30].response.content'))
customLog(get(largeObject, 'log.entries[30].response.content.text'))
customLog('-----------------\n')

customLog('All about 38:')
customLog(get(largeObject, 'log.entries[38].request'))

customLog(get(largeObject, 'log.entries[38].request.headers'))
customLog(get(largeObject, 'log.entries[38].request.headers[29]'))
customLog(get(largeObject, 'log.entries[38].request.headers[29].value'))

customLog(get(largeObject, 'log.entries[38].request.postData'))
customLog(get(largeObject, 'log.entries[38].request.postData.text'))
customLog(get(largeObject, 'log.entries[38].request.postData.params'))
customLog(get(largeObject, 'log.entries[38].request.postData.params[20]'))
customLog(get(largeObject, 'log.entries[38].request.postData.params[20].value'))


customLog('log.entries[38].response:')
customLog(get(largeObject, 'log.entries[38].response'))

customLog('log.entries[38].response.content:')
customLog(get(largeObject, 'log.entries[38].response.content'))

customLog('log.entries[38].response.content.text:')
customLog(get(largeObject, 'log.entries[38].response.content.text'))
