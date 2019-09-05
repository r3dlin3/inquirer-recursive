var _ = require("lodash");
var util = require("util");
var inquirer = require("inquirer");

var Base = require("inquirer/lib/prompts/base");

module.exports = Prompt;

function Prompt(question, rl, answers) {
    // Set defaults prompt options
    this.opt = _.defaults(_.clone(question), {
        validate: function () { return true; },
        filter: function (val) { return val; },
        when: function () { return true; }
    });
    this.responses = [];
    return this;
}
util.inherits(Prompt, Base);

Prompt.prototype.makePrompt = function () {
    return {
        default: true,
        type: 'confirm',
        name: 'loop',
        message: this.opt.message || 'Would you like to loop ?'
    }
}

Prompt.prototype.askForLoop = function () {
    inquirer.prompt(this.makePrompt()).then(answers => {
        if (answers.loop) {
            this.askNestedQuestion();
        } else {
            this.status = 'answered';
            this.done(this.responses);
        }
    });
}

Prompt.prototype.askNestedQuestion = function () {
    inquirer.prompt(this.opt.prompts).then(answers => {
        this.responses.push(answers);
        this.askForLoop();
    });
}


Prompt.prototype._run = function (cb) {
    this.done = cb;
    this.askForLoop();
    return this;
};

Prompt.prototype.close = function () {
    // Do Nothing
}
