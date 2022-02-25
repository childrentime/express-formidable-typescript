import formidable, { Fields, Files } from "formidable";
import express from "express";

type Options = formidable.Options;

declare global {
  namespace Express {
    interface Request {
      fields?: Fields;
      files?: Files;
    }
  }
}

export interface FormidableEvent {
  event: formidable.EventNames;
  action: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    ...param: any[]
  ) => void;
}
export default function parse(options?: Options, events?: FormidableEvent[]) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const form = formidable(options);

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
