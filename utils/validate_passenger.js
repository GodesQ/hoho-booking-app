const validatePassenger = (currentPassenger) => {
    let errors = {};

    if (!currentPassenger.firstname.trim()) {
        errors.firstname = "First name is required";
    }
    if (!currentPassenger.lastname.trim()) {
        errors.lastname = "Last name is required";
    }
    if (!currentPassenger.passport_number.trim()) {
        errors.passport_number = "Passport number is required";
    }
    if (!currentPassenger.ticket_number.trim()) {
        errors.ticket_number = "Ticket number is required";
    }
    if (!currentPassenger.mobile_number.trim()) {
        errors.mobile_number = "Mobile number is required";
    }
    if (!currentPassenger.email_address.trim()) {
        errors.email_address = "Email address is required";
    }
    if (!currentPassenger.confirm_email.trim()) {
        errors.confirm_email = "Confirm email is required";
    } else if (currentPassenger.email_address !== currentPassenger.confirm_email) {
        errors.confirm_email = "Emails do not match";
    }
    if (!currentPassenger.destination.trim()) {
        errors.destination = "Destination is required";
    }
    if (!currentPassenger.departure_date.trim()) {
        errors.departure_date = "Departure date is required";
    }
    if (!currentPassenger.class_type.trim()) {
        errors.class_type = "Class type is required";
    }
    if (!currentPassenger.amount) {
        errors.amount = "Amount is required";
    }

    return errors;
};

export default validatePassenger;
