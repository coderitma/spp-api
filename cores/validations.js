exports.validateRequired = async (data, field) => {
  if (!data) {
    return {
      field,
      message: `${field} is required.`,
    };
  }
};

exports.validateExist = async (schema, filters, field) => {
  let result = await schema.findOne(filters);
  if (result) {
    return { field, message: `${field} is exist.` };
  }
};

exports.validateNotExist = async (schema, filters, field) => {
  let result = await schema.findOne(filters);
  if (!result) {
    return { field, message: `${field} is not exist.` };
  }
};

exports.validateNotFound = async (schema, filters, field) => {
  let result = await schema.findOne(filters);
  if (result) {
    return {
      statusCode: 404,
      message: `${field} not found.`,
    };
  }
};

exports.validateExistWithoutThis = async (
  schema,
  keyNotEqual,
  valueNotEqual,
  keyEqual,
  valueEqual
) => {
  let result = await schema.findOne({
    field,
    [keyNotEqual]: { $ne: valueNotEqual },
    [keyEqual]: valueEqual,
  });

  if (result) {
    return {
      field: field,
      message: `${keyEqual} is available on another data.`,
    };
  }
};

exports.validateMustGTE = async (toValue, fromValue, field) => {
  if (!(toValue >= fromValue)) {
    return {
      field,
      message: `${toValue} must be greater than or equal from ${fromValue}`,
    };
  }
};

exports.validateMustGT = async (toValue, fromValue, field) => {
  if (!(toValue > fromValue)) {
    return {
      field,
      message: `${toValue} must be greater than from ${fromValue}`,
    };
  }
};

exports.validateMustLTE = (toValue, fromValue, field) => {
  if (!(toValue >= fromValue)) {
    return {
      field,
      message: `${toValue} must be less than or equal from ${fromValue}`,
    };
  }
};

exports.validateMustLT = (fromValue, toValue) => {};

exports.validateEqual = (fromValue, toValue) => {};
