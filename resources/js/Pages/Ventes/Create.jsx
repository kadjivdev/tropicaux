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

export default function Create({ partenaires, modes, camions, chargements }) {
    const permissions = usePage().props.auth.permissions;
    const [i, setI] = useState(1);
    const [iCamion, setIcamion] = useState(1);

    const allChargements = chargements
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
    } = useForm({
        partenaire_id: "",
        chargement_id: "",
        prix: "",
        // montant: "",
        document: "",
        poids: "",
        nbre_sac_rejete: "",
        prix_unitaire_sac_rejete: '',
        commentaire: "",
        modes: lignes,
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
        console.log("Lignes camions à partir du useEffect :", ligneCamions)
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
            paiement_mode_id: '',
        }]);

        setI(i + 1)
        console.log("initial lignes ", lignes)
    };

    useEffect(() => {
        setData("modes", lignes);
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
        console.log("Data en json", data)

        post(route('vente.store'), {
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

    // Filtrage
    const handleChargementSelection = (option) => {
        setData('chargement_id', option.value)
        let chargementSelected = allChargements.find((c) => c.id == option.value)

        setCamionLignes(chargementSelected.camions);
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cibAddthis} /> Ajout des Ventes
                </h2>
            }
        >
            <Head title="Ajouter une vente" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('vente.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("vente.index")}> <CIcon icon={cilList} /> Liste des ventes</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <InputLabel htmlFor="partenaire_id" value="Partenaire" >  <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un partenaire ..."
                                                name="partenaire_id"
                                                id="partenaire_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={partenaires.map((partenaire) => ({
                                                    value: partenaire.id,
                                                    label: `${partenaire.raison_sociale}`,
                                                }))}
                                                value={partenaires
                                                    .map((partenaire) => ({
                                                        value: partenaire.id,
                                                        label: `${partenaire.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.partenaire_id)} // set selected option
                                                onChange={(option) => setData('partenaire_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.partenaire_id} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="prix" value="Le Prix" >  <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                type="number"
                                                id="prix"
                                                className="mt-1 block w-full"
                                                value={data.prix}
                                                placeholder="Ex: 78000"
                                                onChange={(e) => setData('prix', e.target.value)}
                                                autoComplete="prix"
                                                min={1}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.prix} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="document" value="Document(preuve)" ></InputLabel>
                                            <TextInput
                                                type="file"
                                                id="document"
                                                className="mt-1 block w-full"
                                                placeholder="Ex: 30.0"
                                                onChange={(e) => setData('document', e.target.files[0])}
                                                autoComplete="document"
                                            />
                                            <InputError className="mt-2" message={errors.document} />
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="poids" value="Le poids" > <span className="text-danger">*</span></InputLabel>
                                            <TextInput
                                                type="number"
                                                id="poids"
                                                className="mt-1 block w-full"
                                                value={data.poids}
                                                placeholder="Ex: 30.0"
                                                onChange={(e) => {
                                                    setData('poids', e.target.value)
                                                }}
                                                autoComplete="poids"
                                                required
                                                min={1}
                                            />
                                            <InputError className="mt-2" message={errors.poids} />
                                        </div>
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="nbre_sac_rejete" value="Sacs rejeté" ></InputLabel>
                                            <TextInput
                                                type="number"
                                                id="nbre_sac_rejete"
                                                className="mt-1 block w-full"
                                                value={data.nbre_sac_rejete}
                                                placeholder="Ex: 3.0"
                                                onChange={(e) => setData('nbre_sac_rejete', e.target.value)}
                                                autoComplete="nbre_sac_rejete"
                                                min={1}
                                            />
                                            <InputError className="mt-2" message={errors.nbre_sac_rejete} />
                                        </div>
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="prix_unitaire_sac_rejete" value="Prix unitaire de Sacs rejeté" ></InputLabel>
                                            <TextInput
                                                type="number"
                                                id="prix_unitaire_sac_rejete"
                                                className="mt-1 block w-full"
                                                value={data.prix_unitaire_sac_rejete}
                                                placeholder="Ex: 3.0"
                                                onChange={(e) => setData('prix_unitaire_sac_rejete', e.target.value)}
                                                autoComplete="prix_unitaire_sac_rejete"
                                                min={1}
                                            />
                                            <InputError className="mt-2" message={errors.prix_unitaire_sac_rejete} />
                                        </div>
                                    </div>
                                </div>

                                {/* Le chargement */}
                                <div className="row">
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <InputLabel htmlFor="chargement_id" value="Le Chargement concerné" >  <span className="text-danger">*</span> </InputLabel>
                                            <Select
                                                placeholder="Rechercher un chargement ..."
                                                name="chargement_id"
                                                id="chargement_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={chargements.map((chargement) => ({
                                                    value: chargement.id,
                                                    label: `${chargement.reference}`,
                                                }))}
                                                value={chargements
                                                    .map((chargement) => ({
                                                        value: chargement.id,
                                                        label: `${chargement.reference}`,
                                                    }))
                                                    .find((option) => option.value === data.chargement_id)} // set selected option
                                                onChange={(option) => handleChargementSelection(option)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.chargement_id} />
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
                                    <span className="text-success"><CIcon icon={cilList} /> Modes de paiements</span>
                                    <button className="btn btn-success bg-hover"
                                        onClick={(e) => addLine(e)}> <CIcon className='' icon={cibAddthis} /> Ajouter un mode de paiement</button>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">N°</th>
                                            <th scope="col">Mode de paiement</th>
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
                                                                    placeholder="Rechercher un mode de paiement ..."
                                                                    name="paiement_mode_id"
                                                                    className="form-control mt-1 block w-full"
                                                                    options={modes.map((mode) => ({
                                                                        value: mode.id,
                                                                        label: mode.libelle,
                                                                    }))}
                                                                    value={modes
                                                                        .map((mode) => ({
                                                                            value: mode.id,
                                                                            label: mode.libelle,
                                                                        }))
                                                                        .find((option) => option.value === data.paiement_mode_id)}
                                                                    onChange={(option) => {
                                                                        const updated = [...lignes];
                                                                        updated[index].paiement_mode_id = option.value;
                                                                        setLignes(updated);
                                                                    }}
                                                                    required
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className='items-center'>
                                                            <button className="btn btn-sm btn-danger shadow-sm rounded"
                                                                onClick={() => removeLine(data.id)}> <CIcon icon={cilCut} /> </button>
                                                        </td>
                                                    </tr>
                                                )) : <tr className='text-center'><td colSpan={3}>Aucun mode de paiement disponible <InputError className="mt-2" message={errors.modes} /></td></tr>}
                                    </tbody>
                                </table>

                                {/* Observation */}
                                <div className="row">
                                    <div className="col-12">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="commentaire" value="Observation" > </InputLabel>
                                            <Textarea
                                                id="commentaire"
                                                type="text"
                                                className="mt-1 block w-full form-control"
                                                placeholder='Laissez une commentaire ici ...'
                                                value={data.observation}
                                                onChange={(e) => setData('commentaire', e.target.value)}
                                                autoComplete="commentaire"
                                            />
                                            <InputError className="mt-2" message={errors.commentaire} />
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