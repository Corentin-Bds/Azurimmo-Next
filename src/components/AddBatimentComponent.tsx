import Batiment from "@/models/Batiment";
import {Button, Divider, Form, Input} from "antd";
import {useState} from "react";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";

export default function AddBatimentComponent({...props}:{
    batiment:Batiment,
    onSubmit:(batiment:Batiment)=>void,
    onClose:(show:boolean)=>void
}) {
   const [batiment, setBatiment] = useState<Batiment>(props.batiment);


    return (
        <>
            <Form>
                <Input placeholder={"Adresse"}
                       value={batiment.adresse}
                       onChange={(e)=>{
                            setBatiment({...batiment,adresse:e.target.value});
                       }}
                />
                <Input placeholder={"Ville"}
                       value={batiment.ville}
                          onChange={(e)=>{
                             setBatiment({...batiment,ville:e.target.value});
                          }}
                />
                <Divider/>
                <div className={"flex justify-between"}>
                    <Button onClick={()=>{
                        props.onSubmit(batiment);
                    }}>Valider</Button>

                    <Button onClick={(e)=>{
                        e.preventDefault();
                        props.onClose(false);
                    }}>Annuler</Button>
                </div>
            </Form>
        </>
    );


}