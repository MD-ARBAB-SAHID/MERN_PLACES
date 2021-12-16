import React, { useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import useHttpClient from '../../shared/hooks.js/http-client';
// import Map from '../../shared/components/UIElements/Map';
import { useHistory } from 'react-router-dom';
import './PlaceItem.css';
import { useContext } from 'react';
import AuthContext from '../../shared/contextApi/AuthContext';

const PlaceItem = props => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
const {isLoading,error,sendRequest,errorHandler} = useHttpClient();
  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async() => {
    setShowConfirmModal(false);
    try{
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,"DELETE",{
        'Authorization':"Bearer "+authCtx.token
      });

      history.replace("/");
    }catch(err){

    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler}/>
      
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        {/* <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div> */}
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
         <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
           <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      <li className="place-item">
      {isLoading && <LoadingSpinner asOverlay/>}
        <Card className="place-item__content">
       
          <div className="place-item__image">
           
            <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
          
            {authCtx.userId===props.creatorId && <Button to={`/places/${props.id}`}>EDIT</Button>}
         { authCtx.userId===props.creatorId &&  <Button danger onClick={showDeleteWarningHandler}>
              DELETE
            </Button>}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
