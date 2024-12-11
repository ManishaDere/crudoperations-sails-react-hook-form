/**
 * Interviews.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
      jobTitle: { type: 'string', required: true },
      interviewerEmail: { 
        type: 'string', 
        required: true,
        custom: function (value) {
          // Regular expression for validating email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
       },
      // Date and Time of the interview
      dateAndTime: {
        type: 'ref',
        columnType: 'datetime',
        required: true
      },
      // Candidate Information (Embedded Object)
      candidate: {
        type: 'json',
        required: true,
        custom: (value) => {
          if (
            typeof value.name !== 'string' || value.name.trim() === '' ||
            typeof value.email !== 'string' || value.email.trim() === '' ||
            typeof value.phone !== 'string' || value.phone.trim() === ''
          ) {
            throw new Error('Candidate information is incomplete');
          }
      
          // Phone number validation (10-digit format)
          const phoneRegex = /^[0-9]{10}$/;
          if (!phoneRegex.test(value.phone)) {
            throw new Error('Phone number is not valid');
          }
      
          return true;
        }
      },
      associateTags: {
        type: 'json',
        description: 'An array of tag objects with beginner, intermediate, and advanced ratings',
        required: true,
        custom: (value) => Array.isArray(value) && value.every(tag => (
          typeof tag.tagName === 'string' &&
          typeof tag.beginner === 'number' &&
          typeof tag.intermediate === 'number' &&
          typeof tag.advanced === 'number'
        ))
      },

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

