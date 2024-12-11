/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const CustomerController = require("../api/controllers/CustomerController");

module.exports.policies = {

  '*': true,

  // Bypass the `is-logged-in` policy for:
  'entrance/*': true,
  'account/logout': true,
  'view-homepage-or-redirect': true,
  'view-faq': true,
  'view-contact': true,
  'legal/view-terms': true,
  'legal/view-privacy': true,
  'deliver-contact-form-message': true,
  'item/search': true, // Allow public access to all actions
  'customer/createUser': true,
  'interviews/create': true,
  'interviews/get': true,
  'interviews/delete': true,
  'interviews/update': true,
  'interviews/get/:id': true,
  // Allow public access to register action
};
