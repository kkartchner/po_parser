// Create number formatter.
var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

var LineItem = /** @class */ (function () {
  function LineItem(poNum, itemNum, description, caseQty) {
    this.poNum = poNum;
    this.itemNum = itemNum;
    this.description = description;
    this.caseQty = caseQty;
  }
  LineItem.prototype.toString = function () {
    return (
      "'"+ this.poNum +
      "\t" +
      "'" + this.itemNum +
      "\t" +
      this.description +
      "\t" +
      this.caseQty
    );
  };
  return LineItem;
})();

function parsePDFData() {
  let raw_data = document.getElementById("inputTA").value;
  let dataArray = raw_data.split("\n");

  let lineItems = [];

  let poNumber = "";

    let line18Data = dataArray[18].split(" ");
    if (line18Data[1] === "Net") {
      poNumber = dataArray[14];
    } else {
      poNumber = dataArray[18]
    }

  for (let i = 25; i < dataArray.length; i += 2) {
    let line1Data = dataArray[i].split(" ");
    if (line1Data[0] === "Net") {
      break;
    } else if (line1Data[0] === "Continued"){
      i += (22 - 2); // Skip 22 lines (-2 because of default loop increment of 2)
      continue;
    }

    let itemNum = line1Data[0];
    let caseQty = line1Data[2];

    let line2 = dataArray[i + 1];
    let endIndex = line2.indexOf("Whse:");
    let description = line2.slice(0, endIndex);

    lineItems.push(new LineItem(poNumber, itemNum, description, caseQty));
  }
  console.log(lineItems);

  let outputString = "";
  lineItems.forEach((li) => {
    outputString += li.toString() + "\n";
  });

  document.getElementById("outputTA").value = outputString;
  CopyOutputData();
}

function CopyOutputData() {
  document.getElementById("outputTA").select();
  document.execCommand("copy");
}

function clearTextAreas() {
  /* Clear text areas */
  for (let ta of document.getElementsByTagName("textarea")) {
    ta.value = "";
  }
}
