import React, { Fragment } from "react";
import PropTypes from "prop-types";

function ProfileAbout({
  profile: {
    bio,
    skills,
    user: { name },
  },
}) {
  return (
    <div class="profile-about bg-light p-2">
      {bio && (
        <Fragment>
          <h2 class="text-primary">{name}</h2>
          <p>{bio}</p>
          <div class="line"></div>
        </Fragment>
      )}

      <h2 class="text-primary">Skill Set</h2>
      <div class="skills">
        {skills.map((skill, index) => (
          <div key={index} class="p-1">
            <i class="fa fa-check"></i> <span>{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
