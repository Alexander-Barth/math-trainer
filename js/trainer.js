/******************************************************************************
 *                                                                            *
 *  Copyright (C) 2018 Alexander Barth <barth.alexander@gmail.com>.           *
 *                                                                            *
 *  This program is free software: you can redistribute it and/or modify      *
 *  it under the terms of the GNU Affero General Public License as published  *
 *  by the Free Software Foundation, either version 3 of the License, or      *
 *  (at your option) any later version.                                       *
 *                                                                            *
 *  This program is distributed in the hope that it will be useful,           *
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of            *
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
 *  GNU Affero General Public License for more details.                       *
 *                                                                            *
 *  You should have received a copy of the GNU Affero General Public License  *
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.     *
 *                                                                            *
 ******************************************************************************/


function Question(el) {
    var that = this;
    this.solutions = eval(el.getAttribute("data-solution"));

    // solutions found
    this.found = {};
    this.foundsolutions = this.solutions.map(function(x) { return {}; });

    // main element
    this.form = el;

    // div element for the developpement
    this.dev = document.createElement("div");

    // template for the input line
    this.newline = document.createElement("input");
    this.newline.setAttribute("type","text");
    this.newline.setAttribute("spellcheck","false");
    this.newline.classList.add("line");
    this.dev.appendChild(this.newline.cloneNode());
    el.appendChild(this.dev);

    // assessment
    this.assess = document.createElement("div");
    this.assess.classList.add("assessmement");
    this.assess.append(document.createTextNode("Super!"))
    this.assess.style.display = "none";
    this.form.append(this.assess);

    // check for changes
    this.dev.addEventListener("input",function(event) { that.changed(event); }, true);

};

Question.prototype.changed = function(ev) {
    this.validate(ev.target); 
    
    //console.log("last ",dev.lastChild,dev.lastChild.value)
    if (this.dev.lastChild.value !== "") {
        // add a new line
        this.dev.appendChild(this.newline.cloneNode());
    }

    var elem = this.dev.firstChild;

    while (elem !== this.dev.lastChild && elem !== null) {
        if (elem.value === "") {
            this.dev.removeChild(elem);
        }
        
        elem = elem.nextSibling;        
    }

    // check if all solutions where found
    var foundall = true;
    
    for (var i = 0; i < this.solutions.length; i++) {
        foundall = foundall & 
            (JSON.stringify(Object.keys(this.solutions[i]).sort()) === 
             JSON.stringify(Object.keys(this.foundsolutions[i]).sort()));        
    }

    if (foundall) {
        this.form.classList.add("solved");
        this.assess.style.display = "block";
    }

};


// verify individual line
Question.prototype.validate = function(elem) {
    var tol = 1e-6;
    var str = elem.value;

    var expr = str.split("=");
    elem.classList.remove("answer");
    elem.classList.remove("valid");

    if (expr.length == 2) {
        var lhs = expr[0].trim();

        for (var i = 0; i < this.solutions.length; i++) {
            var value = this.solutions[i][lhs];

            if (value !== undefined) {
                if (Math.abs(math.eval(expr[1].trim()) - value) < tol) {
                    elem.classList.add("answer");
                    this.foundsolutions[i][lhs] = true; 
                    return;
                }
            }
        }

        valid = false;

        for (var i = 0; i < this.solutions.length; i++) {
            valid = valid || (Math.abs(math.parse(expr[0]).eval(this.solutions[i]) -
                                       math.parse(expr[1]).eval(this.solutions[i])) < tol);
        }
        
        if (valid) {
            elem.classList.add("valid");
            return
        }
    }
};

ex = document.getElementsByClassName("ex");

for (var i = 0; i < ex.length; i++) {
    var q = new Question(ex[i]);
}

