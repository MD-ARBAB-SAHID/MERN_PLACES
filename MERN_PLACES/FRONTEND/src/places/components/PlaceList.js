import React from "react";
import "./PlaceList.css"
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
const PlaceList =  (props)=>{
    if(props.items.length ===0)
    {
        return (<div className="center">
<Card>
    <h2>No Places Found</h2>
    <Button to="/places/new">Share</Button>
</Card>


        </div>

        )
    }
    return ( <ul className="place-list" >
        {props.items.map((place)=>{
            return(<PlaceItem 
                key={place.id}
                id={place.id}
                image={place.image}
                title={place.title}
                description={place.description}
                creatorId = {place.creator}
                coordinates={place.location}
                address={place.address}
                />)
                
         
        })
    }
        </ul>
    )

}
export default PlaceList