// https://stackoverflow.com/questions/5834318/are-variable-operators-possible
// Math library
var operations = {
  x: function(a, b) {
    return b * a;
  },
  "÷": function(a, b) {
    return b / a;
  },
  "+": function(a, b) {
    return b + a;
  },
  "-": function(a, b) {
    return b - a;
  }
};
const isOper = /(-|\+|÷|x)/;

var util = {
  splitNumAndOper: function(rawString) {
    // https://stackoverflow.com/questions/49546448/javascript-split-a-string-into-array-matching-parameters

    // Clean up data before Tokenization by applying Math Associative Property
    rawString = rawString.replace(/\-/, "+-");
    if (rawString.charAt(0) == "+") {
      rawString = rawString.substring(1);
    }

    // Tokenize operators from numeric strings
    let splitArray = rawString.split(/([^-0-9.]+)/);

    // Parse numeric tokens into floats to prevent string concatenation during calculation
    splitArray = splitArray.map(function(el) {
      if ($.isNumeric(el)) {
        return parseFloat(el);
      } else {
        return el;
      }
    });

    return splitArray;
  },
  exceedDisplay: function(rawString) {
    return rawString.length > 9 ? true : false;
  },
  shuntyardSort: function(rawArr) {
    if (!Array.isArray(rawArr)) {
      console.error("shuntyardSort did not receive an Array");
    }

    let valueStack = [];
    let operStack = [];
    let isOperPushReady = false;
    const PEMDAS = {
      x: 2,
      "÷": 2,
      "+": 1,
      "-": 1
    };

    // Convert infix to PEMDAS postfix
    rawArr.forEach(function(el, index, arr) {
      if ($.isNumeric(el)) {
        // We have a number
        valueStack.push(el);
        // Oper always adjacent to left and right num, this accounts for right num
        if (isOperPushReady) {
          valueStack = valueStack.concat(operStack.reverse());
          operStack = [];
          isOperPushReady = false;
        }
      } else {
        // We have an operator
        operStack.push(el);
        // Need at least 2 oper to compare if current operator has higher precedence than previous
        if (
          operStack.length !== 1 &&
          PEMDAS[el] > PEMDAS[operStack.slice(-2)[0]]
        ) {
          isOperPushReady = true;
        }
      }
    });
    // Push remaining operators onto valuestack
    valueStack = valueStack.concat(operStack);
    return valueStack;
  },
  shuntyardCalc: function(rawArr) {
    // Find first Operator except (-) because its reserved as a neg num not an operator anymore
    function findFirstOperator(element) {
      return /(\+|÷|x)/.test(element);
    }

    if (!Array.isArray(rawArr)) {
      console.error("shuntyardCalc did not receive an Array");
    }
    let infiniteLoopCounter = 0;
    let index = 0;
    let evalPartial = 0;
    let firstNum = 0;
    let secondNum = 0;
    let op = 0;

    /*
     * Calculate the postfix after Djikstras Shuntyard Sort Algo
     * By finding the first operator index, calculating operand + 2previous values
     * and pushing result back in
     * Repeat until everything is calculated
     */
    while (rawArr.length > 1) {
      index = rawArr.findIndex(findFirstOperator);
      firstNum = parseFloat(rawArr.splice(index - 1, 1));
      secondNum = parseFloat(rawArr.splice(index - 2, 1));
      op = rawArr.splice(index - 2, 1);
      evalPartial = operations[op](firstNum, secondNum);
      evalPartial = Math.round(evalPartial * 10000000000) / 10000000000;
      rawArr.splice(index - 2, 0, evalPartial);

      infiniteLoopCounter++;
      if (infiniteLoopCounter > 10) {
        debugger;
      }
    }

    return rawArr.toString();
  },
  grabLastToken: function(rawStr) {
    //https://stackoverflow.com/questions/49546448/javascript-split-a-string-into-array-matching-parameters
    return rawStr == "" || rawStr == "0."
      ? rawStr
      : rawStr.match(/\d+|[\+-\/x÷]/g).pop();
  }
};

var view = {
  render: function(cache, buttonValue) {
    // Use placeholder vars for display to prevent 0 and "" confusion
    let topDisplay = util.grabLastToken(cache);
    let botDisplay = cache;

    if (buttonValue == "CE") {
      topDisplay = 0;
    }
    if (botDisplay == "") {
      botDisplay = 0;
    }
    if (topDisplay == "") {
      topDisplay = 0;
    }
    $("#topDisplay").html(topDisplay);
    $("#botDisplay").html(botDisplay);
    console.log(cache);
    console.log(typeof cache);
  }
};

var model = {
  getAnswer: function(cache) {
    return cache.split("=")[1];
  },
  pushDot: function(cache, lastCall) {
    if (lastCall == "calculate" || cache == "") {
      cache = "0";
    }
    // Grab last numeric token and check if it has a "." in it
    return cache.match(/[\d.]+$/g)[0].includes(".") ? cache : cache + ".";
  },
  pushNumber: function(cache, buttonValue, lastCall) {
    return lastCall == "calculate" ? buttonValue : cache + buttonValue;
  },
  pushOperator: function(cache, buttonValue, lastCall) {
    if (cache == "") {
      return cache;
    }
    if (isOper.test(cache.slice(-1))) {
      cache = cache.slice(0, -1);
    }
    return cache + buttonValue;
  },
  clearAll: function(cache, lastCall) {
    return "";
  },
  clearEntry: function(cache, lastCall) {
    //https://stackoverflow.com/questions/11134004/regex-that-will-match-the-last-occurrence-of-dot-in-a-string/
    // targets last operator +÷x- and its' remaining string .......replaces it with nothing
    // 1. (\+|÷|x|-)     Seek Operators.
    // 2. (?=            Conditional check....
    // 3. [^(\+|÷|x|\-)] For any other operators until end.
    // 4. *$)(.*)/       Grab everything after
    const lastEntry = /(\+|÷|x|-)(?=[^(\+|÷|x|\-)]*$)(.*)/;

    if (cache.includes("=")) {
      cache = "";
    } else if (isOper.test(cache.slice(-1))) {
      // if lastchar is operator
      cache = cache.slice(0, -1); // delete
    } else if (isOper.test(cache)) {
      // If string has operator
      cache = cache.replace(lastEntry, "$1"); // remove numbers ahead
    } else {
      // no operators
      cache = "";
    }
    return cache;
  },
  calculate: function(cache, lastCall) {
    if (isOper.test(cache.slice(-1)) || cache.slice(-1) == ".") {
      return cache;
    }
    let tempArr = util.splitNumAndOper(cache);

    // Edsger Dijkstra - Shuntyard Algorithm
    tempArr = util.shuntyardSort(tempArr);
    tempArr = util.shuntyardCalc(tempArr);
    cache = cache + "=" + tempArr.toString();
    return cache;
  }
};

// Display, Read, Update, Destroy
// VIEWS + CONTROLLER IN JQUERY
$(document).ready(function() {
  let cache = "";
  let lastCall = "clearAll"; // Assume last functionCall is a hard reset
  // Condense down into one click button
  $("button").on("click", function() {
    let buttonValue = $(this).attr("value");
    switch (buttonValue) {
      // Numbers
      case ".":
        cache = model.pushDot(cache, lastCall);
        lastCall = "pushDot";
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        cache = model.pushNumber(cache, buttonValue, lastCall);
        lastCall = "pushNumber";
        break;
      case "x":
      case "÷":
      case "-":
      case "+":
        cache = model.pushOperator(cache, buttonValue, lastCall);
        lastCall = "pushOperator";
        break;
      case "AC":
        cache = model.clearAll(cache, lastCall);
        lastCall = "clearAll";
        break;
      case "CE":
        cache = model.clearEntry(cache, lastCall);
        lastCall = "clearEntry";
        break;
      case "=":
        cache = model.calculate(cache, lastCall);
        lastCall = "calculate";
        break;
      default:
        console.log("ERROR DEFAULT CASE SHOULD NOT RUN!");
        break;
    }
    view.render(cache, buttonValue);

    if (lastCall == "calculate") {
      cache = model.getAnswer(cache);
    }
  });
});

// Unit Test Case

// MOCHA - test

// UI
mocha.setup("bdd");

mocha.setup({
  ui: "bdd"
});

// CHAI
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

// Based on http://yeoman.io/contributing/testing-guidelines.html

describe("MODEL", function() {
  describe("getAnswer", function() {
    it("grab number token after =", function() {
      assert.equal("99", model.getAnswer("44+55=99"));
    });
  });

  describe("pushDot", () => {
    it('forbid multiple "." for one token', () => {
      assert.equal("9.99", model.pushDot("9.99"));
    });
    it("add dot if none present", () => {
      assert.equal("999x9.", model.pushDot("999x9"));
    });
    it("add zero if empty cache", () => {
      assert.equal("0.", model.pushDot(""));
    });
    it("reset to zero if calculate lastcall", () => {
      assert.equal("0.", model.pushDot("999", "calculate"));
    });
    it('limit one "." per token', function() {
      assert.equal("12.34+56.", model.pushDot("12.34+56"));
    });
  });
  describe("pushNumber", () => {
    it("push number as a char", () => {
      assert.equal("9", model.pushNumber("", 9));
    });
    it("concatenate as chars not add", () => {
      assert.equal("99", model.pushNumber("9", "9"));
    });
    it("reset if lastCall is calculate", () => {
      assert.equal("5", model.pushNumber("999", "5", "calculate"));
    });
  });

  describe("pushOperator", () => {
    it("forbid sequential operators", () => {
      assert.equal("999+555+", model.pushOperator("999+555+", "+"));
    });
    it("forbid operators on empty cache", () => {
      assert.equal("", model.pushOperator("", "+"));
    });
    it("allow swappable operators", () => {
      assert.equal("123+", model.pushOperator("123-", "+"));
    });
  });

  describe("clearAll", () => {
    it("clear everything", () => {
      assert.equal("", model.clearAll("555+555"));
    });
  });

  describe("clearEntry", () => {
    it("delete all if no operators", () => {
      assert.equal("", model.clearEntry("5555"));
    });
    it("delete operator if cache's last char", () => {
      assert.equal("555", model.clearEntry("555+"));
    });
    it("delete number token before operator", () => {
      assert.equal("555+", model.clearEntry("555+444"));
    });
    it("delete all if calculate lastcall", () => {
      assert.equal("", model.clearEntry("5+5=10"));
    });
  });

  describe("calculate", () => {
    it("do order of operations", () => {
      assert.equal("5+5=10", model.calculate("5+5"));
    });
    it("handle 1 float calc", () => {
      assert.equal("12.34+5=17.34", model.calculate("12.34+5"));
    });
    it("handle 2 float calc", () => {
      assert.equal("6.6+3.3=9.9", model.calculate("6.6+3.3"));
    });
    it("forbid incomplete operation", () => {
      assert.equal("6+", model.calculate("6+"));
    });
  });
}); // END MODEL
///////////////////////////////////////////////////////////
describe("VIEW", function() {
  describe("render", () => {
    it('throw "Digit Limit Met" if lastNumSeq > 9 chars', () => {});
    it('throw "Digit Limit Met" if calculation > 9 chars', () => {});
    it('throw "Digit Limit Met" if cache > 26 char', () => {});
    it("show 0 if cache is blank", () => {});
    it("render curBuffer after Clearall or clearEntry", () => {});
  });
  describe("render CACHE RESETS", () => {
    it('return the number after "=" if it is present', () => {});
  });
}); // END VIEW
///////////////////////////////////////////////////////////
describe("UTIL", function() {
  describe("splitNumAndOper", () => {
    it("do simple math", () => {
      assert.deepEqual([6, "+", 4, "+", 3], util.splitNumAndOper("6+4+3"));
    });
    it("tokenize negative numbers", () => {
      assert.deepEqual([-1, "+", 7], util.splitNumAndOper("-1+7"));
    });
    it("tokenize decimal numbers", function() {
      assert.deepEqual([12.34, "+", 5], util.splitNumAndOper("12.34+5"));
    });
  });

  describe("shuntyardSort", () => {
    it("convert infix to sorted postfix", () => {
      const infix = [1, "+", 2, "x", 3, "+", 4];
      const postfix = [1, 2, 3, "x", "+", 4, "+"];
      assert.deepEqual(postfix, util.shuntyardSort(infix));
    });
  });
  describe("shuntyardCalc", () => {
    it("calculate postfix", () => {
      const sortedPostfix = [1, 2, 3, "x", "+", 4, "+"];
      assert.equal(11, util.shuntyardCalc(sortedPostfix));
    });
    it("calculate postfix with float values", () => {
      assert.equal(17.34, util.shuntyardCalc([12.34, 5, "+"]));
    });
    it("calculate postfix with negative numbers", () => {
      assert.equal(-1, util.shuntyardCalc([2, -3, "+"]));
    });
  });

  describe("grabLastToken", () => {
    it("grab last numeric token", () => {
      assert.equal("123", util.grabLastToken("99999+123"));
    });
    it("do nothing if arg is empty", () => {
      assert.equal("", util.grabLastToken(""));
    });
    it("return operator if last char", () => {
      assert.equal("+", util.grabLastToken("99+"));
    });
    it("handle floats", () => {
      assert.equal("0.", util.grabLastToken("0."));
    });
  });
}); // END UTIL

// RUN MOCHA
mocha.run();
