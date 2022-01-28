const yup = require('yup');


const scheme = yup
  .object({
    applications: yup.array(
      yup
        .object({
          // required props
          name: yup.string().required(`Application "name" is a required prop!`),
          remoteEntry: yup.string().required(`Application "remoteEntry" is a required prop!`),
          exposedModule: yup.string().required(`Application "exposedModule" is a required prop!`),

          // optional props
          require: yup.array(yup.string()),
          pathName: yup.string(),
          ngModule: yup.string(),
        }),
    ),

    /* To add later */
    /* components */
    /* common */
  });

module.exports = scheme;
