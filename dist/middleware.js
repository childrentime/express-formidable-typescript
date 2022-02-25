"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = __importDefault(require("formidable"));
function parse(options, events) {
    return (req, res, next) => {
        const form = (0, formidable_1.default)(options);
        let manageError = false;
        if (events) {
            for (const event of events) {
                if (event.event === "error") {
                    manageError = true;
                }
                form.on(event.event, (...parameters) => {
                    event.action(req, res, next, ...parameters);
                });
            }
        }
        if (!manageError) {
            form.on("error", (err) => {
                next(err);
            });
        }
        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
                return;
            }
            Object.assign(req, {
                fields,
                files,
                express_formidable: { parsed: true },
            });
            next();
        });
    };
}
exports.default = parse;
