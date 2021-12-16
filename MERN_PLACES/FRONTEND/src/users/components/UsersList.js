import React from "react";
import Card from "../../shared/components/UIElements/Card";
import UserItem from "./UserItem";
import "./UsersList.css";
const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Users Found</h2>
        </Card>
      </div>
    );
  } else {
    return (
      <ul className="users-list">
        {props.items.map((user) => {
          return (
            <UserItem
              key={user.id}
              id={user.id}
              placeCount={user.places.length}
              image={user.image}
              name={user.name}
            />
          );
        })}
      </ul>
    );
  }
};

export default UsersList;
