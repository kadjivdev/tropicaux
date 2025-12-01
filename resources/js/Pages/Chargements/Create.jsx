import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilList, cibAddthis, cilCut, cilTruck } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'
import { Textarea } from '@headlessui/react';
import { useEffect, useState } from 'react';

export default function Create({ produits, convoyeurs, superviseurs, magasins, chauffeurs, fournisseurs, camions }) {
    const permissions = usePage().props.auth.permissions;
    const [i, setI] = useState(1);
    const [iCamion, setIcamion] = useState(1);

    const [lignes, setLignes] = useState([]);
    const [ligneCamions, setCamionLignes] = useState([]);

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        post,
        processing,
        // progress
    } = useForm({
        produit_id: "",
        chauffeur_id: "",
        superviseur_id: "",
        convoyeur_id: "",
        magasin_id: "",
        adresse: '',
        observation: "",
        details: lignes,
        camions: ligneCamions,
    });

    
    // Gestion des camions
    const addCamionLine = (e) => {
        e.preventDefault()

        setCamionLignes([...ligneCamions, {
            id: iCamion,
            commentaire: '',
        }]);

        setIcamion(iCamion + 1)
        console.log("initial lignes ", ligneCamions)
    };

    useEffect(() => {
        setData("camions", ligneCamions);
    }, [ligneCamions])

    const removeCamionLine = (id) => {
        let updatedLines = ligneCamions.filter(function (ligne) {
            return ligne.id != id
        });

        setCamionLignes(updatedLines);
    };

    // Gestion des détails
    const addLine = (e) => {
        e.preventDefault()

        setLignes([...lignes, {
            id: i,
            fournisseur_id: '',
            sac_jute: '',
            sac_pp: '',
            tonnage: '',
            prix_achat: ''
        }]);

        setI(i + 1)
        console.log("initial lignes ", lignes)
    };
    
    useEffect(() => {
        setData("details", lignes);
    }, [lignes]);

    const removeLine = (id) => {
        let updatedLines = lignes.filter(function (ligne) {
            return ligne.id != id
        });

        setLignes(updatedLines);
    };

    // Submitting form
    const submit = (e) => {
        e.preventDefault();

        post(route('chargement.store'), {
            onStart: () => {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Opération en cours...</span>', // yellow text
                    text: 'Veuillez patienter pendant que nous traitons vos données.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
            },
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #2a7348;">👌Opération réussie </span>',
                    text: 'Opération réussie',
                    confirmButtonText: '😇 Fermer'
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #facc15;">🤦‍♂️ Opération échouée </span>', // yellow text
                    text: `${e.error ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                    confirmButtonText: '😇 Fermer'
                });
                console.log(e);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cibAddthis} /> Ajout des Chargements
                </h2>
            }
        >
            <Head title="Ajouter un Chargement" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('chargement.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("chargement.index")}> <CIcon icon={cilList} /> Liste des chargements</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <InputLabel htmlFor="produit_id" value="Produit" >  <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un produit ..."
                                                name="produit_id"
                                                id="produit_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={produits.map((produit) => ({
                                                    value: produit.id,
                                                    label: `${produit.libelle}`,
                                                }))}
                                                value={produits
                                                    .map((produit) => ({
                                                        value: produit.id,
                                                        label: `${produit.libelle}`,
                                                    }))
                                                    .find((option) => option.value === data.produit_id)} // set selected option
                                                onChange={(option) => setData('produit_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.produit_id} />
                                        </div>
                                        <div className="mb-3">
                                            <InputLabel htmlFor="chauffeur_id" value="Chauffeur" >  <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un chauffeur ..."
                                                name="chauffeur_id"
                                                id="chauffeur_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={chauffeurs.map((chauffeur) => ({
                                                    value: chauffeur.id,
                                                    label: `${chauffeur.raison_sociale}`,
                                                }))}
                                                value={chauffeurs
                                                    .map((chauffeur) => ({
                                                        value: chauffeur.id,
                                                        label: `${chauffeur.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.chauffeur_id)} // set selected option
                                                onChange={(option) => setData('chauffeur_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.chauffeur_id} />
                                        </div>
                                        <div className="mb-3">
                                            <InputLabel htmlFor="magasin_id" value="Magasin" > </InputLabel>
                                            <Select
                                                placeholder="Rechercher un magasin ..."
                                                name="magasin_id"
                                                id="magasin_id"
                                                // required
                                                className="form-control mt-1 block w-full"
                                                options={magasins.map((magasin) => ({
                                                    value: magasin.id,
                                                    label: `${magasin.libelle}`,
                                                }))}
                                                value={magasins
                                                    .map((magasin) => ({
                                                        value: magasin.id,
                                                        label: `${magasin.libelle}`,
                                                    }))
                                                    .find((option) => option.value === data.magasin_id)} // set selected option
                                                onChange={(option) => setData('magasin_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.magasin_id} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <InputLabel htmlFor="superviseur_id" value="Superviseur" >  <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un superviseur ..."
                                                name="superviseur_id"
                                                id="superviseur_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={superviseurs.map((superviseur) => ({
                                                    value: superviseur.id,
                                                    label: `${superviseur.raison_sociale}`,
                                                }))}
                                                value={superviseurs
                                                    .map((superviseur) => ({
                                                        value: superviseur.id,
                                                        label: `${superviseur.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.superviseur_id)} // set selected option
                                                onChange={(option) => setData('superviseur_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.superviseur_id} />
                                        </div>

                                        <div className="mb-3">
                                            <InputLabel htmlFor="convoyeur_id" value="Convoyeur" ></InputLabel>
                                            <Select
                                                placeholder="Rechercher un convoyeur ..."
                                                name="convoyeur_id"
                                                id="convoyeur_id"
                                                className="form-control mt-1 block w-full"
                                                options={convoyeurs.map((convoyeur) => ({
                                                    value: convoyeur.id,
                                                    label: `${convoyeur.raison_sociale}`,
                                                }))}
                                                value={convoyeurs
                                                    .map((convoyeur) => ({
                                                        value: convoyeur.id,
                                                        label: `${convoyeur.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.convoyeur_id)} // set selected option
                                                onChange={(option) => setData('convoyeur_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.convoyeur_id} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="adresse" value="Lieu de chargement" >  <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                type="text"
                                                id="adresse"
                                                className="mt-1 block w-full"
                                                value={data.adresse}
                                                placeholder="Abomey"
                                                onChange={(e) => setData('adresse', e.target.value)}
                                                autoComplete="adresse"
                                                min={1}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.adresse} />
                                        </div>
                                    </div>
                                </div>

                                <br />
                                {/* Camions */}
                                <div className="d-flex" style={{ justifyContent: 'space-between' }}>
                                    <span className="text-success"><CIcon icon={cilTruck} /> Détail des camions</span>
                                    <button className="btn btn-success bg-hover"
                                        onClick={(e) => addCamionLine(e)}> <CIcon className='' icon={cilTruck} /> Ajouter un camion</button>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">N°</th>
                                            <th scope="col">Camion</th>
                                            <th scope="col">Commentaire</th>
                                            <th scope='col'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="camion">
                                        {
                                            ligneCamions.length > 0 ?
                                                ligneCamions.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="mb-3">
                                                                <Select
                                                                    placeholder="Rechercher un camion ..."
                                                                    name="magasin_id"
                                                                    className="form-control mt-1 block w-full"
                                                                    options={camions.map((camion) => ({
                                                                        value: camion.id,
                                                                        label: camion.libelle,
                                                                    }))}
                                                                    value={camions
                                                                        .map((camion) => ({
                                                                            value: camion.id,
                                                                            label: camion.libelle,
                                                                        }))
                                                                        .find((option) => option.value === data.camion_id)}
                                                                    onChange={(option) => {
                                                                        const updated = [...ligneCamions];
                                                                        updated[index].camion_id = option.value;
                                                                        setCamionLignes(updated);
                                                                    }}
                                                                    required
                                                                />
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <Textarea
                                                                type="text"
                                                                className="mt-1 block w-full form-control"
                                                                value={data.commentaire}
                                                                placeholder="Ex : Ceci est le camion qui a éffectué au premier chargement"
                                                                onChange={(e) => {
                                                                    const updated = [...ligneCamions];
                                                                    updated[index].commentaire = e.target.value;
                                                                    setCamionLignes(updated);
                                                                }}
                                                                required
                                                            />
                                                        </td>

                                                        <td className='items-center'>
                                                            <button className="btn btn-sm btn-danger shadow-sm rounded"
                                                                onClick={() => removeCamionLine(data.id)}> <CIcon icon={cilCut} /> </button>
                                                        </td>
                                                    </tr>
                                                )) : <tr className='text-center'><td colSpan={4}>Aucun camion disponible <InputError className="mt-2" message={errors.camions} /></td></tr>}
                                    </tbody>
                                </table>

                                <br />
                                {/* Détail */}
                                <div className="d-flex" style={{ justifyContent: 'space-between' }}>
                                    <span className="text-success"><CIcon icon={cilList} /> Détail du chargement</span>
                                    <button className="btn btn-success bg-hover"
                                        onClick={(e) => addLine(e)}> <CIcon className='' icon={cibAddthis} /> Ajouter</button>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">N°</th>
                                            <th scope="col">Fournisseur</th>
                                            <th scope="col">Sac de Jute</th>
                                            <th scope="col">Sac PP</th>
                                            <th scope="col">Tonnage</th>
                                            <th scope="col">Prix d'achat</th>
                                            <th scope='col'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="lignes">
                                        {
                                            lignes.length > 0 ?
                                                lignes.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="mb-3">
                                                                <Select
                                                                    placeholder="Rechercher un fournisseur ..."
                                                                    name="fournisseur_id"
                                                                    className="form-control mt-1 block w-full"
                                                                    options={fournisseurs.map((fournisseur) => ({
                                                                        value: fournisseur.id,
                                                                        label: fournisseur.raison_sociale,
                                                                    }))}
                                                                    value={fournisseurs
                                                                        .map((fournisseur) => ({
                                                                            value: fournisseur.id,
                                                                            label: fournisseur.raison_sociale,
                                                                        }))
                                                                        .find((option) => option.value === data.fournisseur_id)}
                                                                    onChange={(option) => {
                                                                        const updated = [...lignes];
                                                                        updated[index].fournisseur_id = option.value;
                                                                        setLignes(updated);
                                                                    }}
                                                                    required
                                                                />
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <TextInput
                                                                type="number"
                                                                className="mt-1 block w-full"
                                                                value={data.sac_jute}
                                                                placeholder="Ex : 10"
                                                                onChange={(e) => {
                                                                    const updated = [...lignes];
                                                                    updated[index].sac_jute = e.target.value;
                                                                    setLignes(updated);
                                                                }}
                                                                required
                                                            />
                                                        </td>

                                                        <td>
                                                            <TextInput
                                                                type="number"
                                                                className="mt-1 block w-full"
                                                                value={data.sac_pp}
                                                                placeholder="Ex : 10"
                                                                onChange={(e) => {
                                                                    const updated = [...lignes];
                                                                    updated[index].sac_pp = e.target.value;
                                                                    setLignes(updated);
                                                                }}
                                                                min={0}
                                                                required
                                                            />
                                                        </td>

                                                        <td>
                                                            <TextInput
                                                                type="number"
                                                                className="mt-1 block w-full"
                                                                value={data.tonnage}
                                                                placeholder="Ex : 10"
                                                                onChange={(e) => {
                                                                    const updated = [...lignes];
                                                                    updated[index].tonnage = e.target.value;
                                                                    setLignes(updated);
                                                                }}
                                                                min={0}
                                                                required
                                                            />
                                                        </td>

                                                        <td>
                                                            <TextInput
                                                                type="number"
                                                                className="mt-1 block w-full"
                                                                value={data.prix_achat}
                                                                placeholder="Ex : 75.000"
                                                                onChange={(e) => {
                                                                    const updated = [...lignes];
                                                                    updated[index].prix_achat = e.target.value;
                                                                    setLignes(updated);
                                                                }}
                                                                min={1}
                                                                required
                                                            />
                                                        </td>

                                                        <td className='items-center'>
                                                            <button className="btn btn-sm btn-danger shadow-sm rounded"
                                                                onClick={() => removeLine(data.id)}> <CIcon icon={cilCut} /> </button>
                                                        </td>
                                                    </tr>
                                                )) : <tr className='text-center'><td colSpan={7}>Aucune ligne disponible <InputError className="mt-2" message={errors.details} /></td></tr>}
                                    </tbody>
                                </table>

                                {/* Observation */}
                                <div className="row">
                                    <div className="col-12">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="observation" value="Observation" > </InputLabel>
                                            <Textarea
                                                id="observation"
                                                type="text"
                                                className="mt-1 block w-full form-control"
                                                placeholder='Laissez une observation ici ...'
                                                value={data.observation}
                                                onChange={(e) => setData('observation', e.target.value)}
                                                autoComplete="observation"
                                            />
                                            <InputError className="mt-2" message={errors.observation} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}> <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer'} </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
