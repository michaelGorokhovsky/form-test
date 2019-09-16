import React from "react";
import { render } from "react-dom";
import useForm from "react-plain-form";
import * as yup from "yup";

import "./styles.css";

const schema = yup.object({
  name: yup
    .string()
    .min(5, "To short. Not less than ${min}")
    .required("Name required")
    .transform(function(value, originalValue) {
      return originalValue.toUpperCase();
    }),

  email: yup
    .string()
    .email()
    .required("Email required")
});

function Form({ schema }) {
  const { fields, values, isValidating, errors, validateAll } = useForm(schema);
  const isErrors = !!Object.keys(errors).length;
  const handleSubmit = e => {
    e && e.preventDefault && e.preventDefault();

    //Native yup schema validation
    /* schema
        .validate(values)
        .then(r => {
            console.info(r);
        })
        .catch(e => {
            console.info(e.message, 'err');
        }) */

    //react-plain-form validation - preferable
    validateAll(values)
      .then(v => {
        console.info(schema.cast(v), "SUBMIT RESULT");
      })
      .catch(e => {
        console.info(e.errors, "SUBMIT ERROR");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input {...fields.name} />
        {errors.name && <span>{errors.name}</span>}
      </label>
      <label>
        Email
        <input {...fields.email} />
        {errors.email && <span>{errors.email}</span>}
      </label>
      <button type="submit" disabled={isValidating || isErrors}>
        Submit
      </button>
      {isValidating && <p>Validating...</p>}
    </form>
  );
}

const formSchema = {
  name: { type: "text" },
  email: { type: "email" }
};

Object.keys(formSchema).forEach(key => {
  let validationSchema;

  try {
    validationSchema = yup.reach(schema, key);
  } catch (error) {
    return;
  }

  formSchema[key].onValidate = values => validationSchema.validate(values[key]);
});

render(<Form schema={formSchema} />, document.querySelector("#root"));
