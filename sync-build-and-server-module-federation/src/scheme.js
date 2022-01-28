const yup = require('yup');
const mapValues = require('lodash.mapvalues');

const scheme = yup
  .object({
    name: yup.string().required(`Application "name" is a required prop!`),
    filename: yup.string().required(`Application "name" is a required prop!`),
    remoteEntry: yup.string().required(`Application "remoteEntry" is a required prop!`),

    remotes: yup.lazy(obj =>
      yup.object(
        mapValues(obj, (_, key) => {
          return yup.array(yup.string().required(`"${key}" remote "name" is a required prop!`));
        })
      )
    ),

    exposes: yup.object({
      applications: yup.array(
        yup
          .object({
            // required props
            exposedModule: yup.string().required(`Application exposes "exposedModule" is a required prop!`),
            exposedFile: yup.string().required(`Application exposes "exposedFile" is a required prop!`),
            pathName: yup.string(),
            exposedNgModule: yup.string(),
          }),
      ),
      components: yup.array(
        yup
          .object({
            // required props
            exposedModule: yup.string().required(`Component exposes "exposedModule" is a required prop!`),
            exposedFile: yup.string().required(`Component exposes "exposedFile" is a required prop!`),
          }),
      ),
      common: yup.array(
        yup
          .object({
            // required props
            exposedModule: yup.string().required(`Common exposes "exposedModule" is a required prop!`),
            exposedFile: yup.string().required(`Common exposes "exposedFile" is a required prop!`),
          }),
      ),
    })
  });

module.exports = scheme;
