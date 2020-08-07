import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

function ProfileEducation({
  education: { school, degree, field_of_study, current, to, from, description },
}) {
  return (
    <div>
      <h3 class="text-dark">{school}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
        {!to ? "Now" : <Moment format="YYYY/MM/DD">{to}</Moment>}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field of study: </strong>
        {field_of_study}
      </p>
      <p>
        <strong>Description: </strong> {description}
      </p>
    </div>
  );
}

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;
