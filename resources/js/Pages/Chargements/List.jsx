import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cilCheckCircle, cilList, cilMenu, cilPencil, cilTruck, cilUserX } from "@coreui/icons";
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import { useState } from 'react';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Textarea } from '@headlessui/react';

export default function List({ chargements }) {
    const permissions = usePage().props.auth.permissions;
    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const [currentChargement, setCurrentChargement] = useState(null);
    const [showCamions, setShowCamions] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const showCamionsModal = (e, chargement) => {
        e.preventDefault();
        setCurrentChargement(chargement);
        setShowCamions(true);
    }

    const closeCamionModal = () => {
        setShowCamions(false);
    }

    const showDetailsModal = (e, chargement) => {
        console.log("Current chargement ", chargement)
        e.preventDefault();
        setCurrentChargement(chargement);
        setShowDetails(true);
    }

    const closeDetailModal = () => {
        setShowDetails(false);
    }

    const { patch, delete: destroy } = useForm({})

    const deleteChargement = (e, chargement) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Le chargement sera supprimé de façon permanente !`,
            showCancelButton: true,
            confirmButtonColor: '#2a7348',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '😇 Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Suppression en cours...</span>', // yellow text
                    text: 'Veuillez patienter pendant que nous traitons vos données.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                destroy(route('chargement.destroy', chargement.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `Le chargement a été supprimé avec succès.`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                    onError: (e) => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #facc15;">🤦‍♂️ Suppression échouée </span>', // yellow text
                            text: `${e.exception ?? 'Veuillez réessayer.'}`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                })
            }
        });
    }

    const validateChargement = (e, chargement) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Ce chargement sera validé de façon permanente !`,
            showCancelButton: true,
            confirmButtonColor: '#2a7348',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '😇 Oui, Valider !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Validation en cours...</span>', // yellow text
                    text: 'Veuillez patienter pendant que nous traitons vos données.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                patch(route('chargement.validate', chargement.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">Validation réussie </span>',
                            text: `Le chargement a été validé avec succès.`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                    onError: (e) => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #facc15;">🤦‍♂️ Validation échouée </span>', // yellow text
                            text: `${e.exception ?? 'Veuillez réessayer.'}`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                })
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Gestion des chargements
                </h2>
            }
        >
            <Head title="Les chargements" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('chargement.create') ?
                            (<div className="text-center  items-center gap-4">
                                <Link className="btn w-50 bg-success bg-hover text-white" href={route("chargement.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col text-center">Action</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Camions</th>
                                    <th scope="col">Détails</th>
                                    <th scope="col">Fonds Superviseurs</th>
                                    <th scope="col">Dépenses Superviseurs</th>
                                    <th scope="col">Produit</th>
                                    <th scope="col">Chauffeur</th>
                                    <th scope="col">Superviseur</th>
                                    <th scope="col">Magasin</th>
                                    <th scope="col">Convoyeur</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Observation</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Validé le</th>
                                    <th scope="col">Validé par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    chargements.data.map((chargement, index) => (
                                        <tr key={chargement.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {!chargement.validated_at ?
                                                    (
                                                        <div className="dropstart">
                                                            <button className="dropdown-toggle inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <CIcon icon={cilMenu} /> Gérer
                                                            </button>

                                                            <ul className="dropdown-menu p-2 border rounded shadow">
                                                                <li>
                                                                    {checkPermission('chargement.edit') && (
                                                                        <Link
                                                                            className="btn text-warning"
                                                                            href={route('chargement.edit', chargement.id)} // ✅ navigation via Inertia
                                                                        >
                                                                            <CIcon icon={cilPencil} /> Modifier
                                                                        </Link>
                                                                    )}
                                                                </li>

                                                                <li>
                                                                    {checkPermission('chargement.validate') && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn text-success"
                                                                            onClick={(e) => validateChargement(e, chargement)} // ✅ action Inertia
                                                                        >
                                                                            <CIcon icon={cilCheckCircle} /> Valider
                                                                        </button>
                                                                    )}
                                                                </li>

                                                                <li>
                                                                    {checkPermission('chargement.delete') && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn text-danger"
                                                                            onClick={(e) => deleteChargement(e, chargement)} // ✅ action Inertia
                                                                        >
                                                                            <CIcon icon={cilUserX} /> Supprimer
                                                                        </button>
                                                                    )}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    ) : '---'
                                                }

                                            </td>
                                            <td className='text-center'>
                                                <span className="badge bg-light rounded text-dark rounded shadow-sm"> {chargement?.reference ?? '---'}</span>
                                            </td>
                                            <td>
                                                <button
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                    onClick={(e) => showCamionsModal(e, chargement)}
                                                >
                                                    <CIcon icon={cilTruck} />
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                    href="#"
                                                    onClick={(e) => showDetailsModal(e, chargement)}
                                                >
                                                    <CIcon icon={cilList} />
                                                </button>
                                            </td>
                                            <td className='text-center'>
                                                <Link
                                                    href={route("chargement.fonds", chargement.id)}
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                >
                                                   <CIcon icon={cilList} /> <strong> {chargement.total_fonds} FCFA</strong>
                                                </Link>
                                            </td>
                                            <td className='text-center'>
                                                <Link
                                                    href={route("chargement.depenses", chargement.id)}
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                >
                                                    <CIcon icon={cilList} /> <strong> {chargement.total_depenses} FCFA</strong>
                                                </Link>
                                            </td>
                                            <td>{chargement?.produit?.libelle ?? '---'}</td>
                                            <td>{`${chargement?.chauffeur?.raison_sociale}`}</td>
                                            <td>{`${chargement?.superviseur?.raison_sociale}`}</td>
                                            <td>{chargement?.magasin?.libelle ?? '---'}</td>
                                            <td>{`${chargement.convoyeur?.raison_sociale ?? '---'}`}</td>
                                            <td>{chargement.adresse}</td>
                                            <td>{chargement.observation}</td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${chargement.createdBy?.firstname} - ${chargement.createdBy?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${chargement.validated_at || '--'}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${chargement.validatedBy?.firstname || ''} - ${chargement.validatedBy?.lastname || ''}`}</span> </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Model des  camions */}
            <Modal show={showCamions} onClose={closeCamionModal}>
                <form className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        <CIcon className='text-success' icon={cilTruck} /> Liste des camions du chargement <span className='badge bg-light rounded border shadow-sm text-success'>{currentChargement?.reference ?? '---'}</span>
                    </h2>

                    <div className="p-2">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Camion</th>
                                    <th scope="col">Commentaire</th>
                                </tr>
                            </thead>
                            <tbody id="camion">
                                {
                                    currentChargement?.camions.length > 0 ?
                                        currentChargement?.camions.map((data, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <TextInput
                                                        type="text"
                                                        className="mt-1 block w-full form-control"
                                                        value={data.camion?.libelle}
                                                        disabled={true}
                                                    />
                                                </td>

                                                <td>
                                                    <Textarea
                                                        type="text"
                                                        className="mt-1 block w-full form-control"
                                                        value={data.commentaire}
                                                        rows={1}
                                                        disabled={true}
                                                    />
                                                </td>
                                            </tr>
                                        )) : <tr className='text-center'><td colSpan={3}>Aucun camion disponible</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton className='text-success' onClick={closeCamionModal}>
                            Fermer
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>

            {/* Model des  details */}
            <Modal show={showDetails} onClose={closeDetailModal}>
                <form className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        <CIcon className='text-success' icon={cilList} /> Détails du chargement <span className='badge bg-light rounded border shadow-sm text-success'>{currentChargement?.reference ?? '---'}</span>
                    </h2>

                    <div className="p-2">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Fournisseur</th>
                                    <th scope="col">Sac de Jute</th>
                                    <th scope="col">Sac PP</th>
                                    <th scope="col">Tonnage</th>
                                    <th scope="col">Prix d'achat</th>
                                </tr>
                            </thead>
                            <tbody id="lignes">
                                {
                                    currentChargement?.details.length > 0 ?
                                        currentChargement?.details.map((data, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <TextInput
                                                        type="text"
                                                        className="mt-1 block w-full"
                                                        value={data.fournisseur?.raison_sociale}
                                                        disabled={true}
                                                    />
                                                </td>

                                                <td>
                                                    <TextInput
                                                        type="number"
                                                        className="mt-1 block w-full"
                                                        value={data.sac_jute}
                                                        disabled={true}
                                                    />
                                                </td>

                                                <td>
                                                    <TextInput
                                                        type="number"
                                                        className="mt-1 block w-full"
                                                        value={data.sac_pp}
                                                        disabled={true}
                                                    />
                                                </td>

                                                <td>
                                                    <TextInput
                                                        type="number"
                                                        className="mt-1 block w-full"
                                                        value={data.tonnage}
                                                        disabled={true}
                                                    />
                                                </td>

                                                <td>
                                                    <TextInput
                                                        type="number"
                                                        className="mt-1 block w-full"
                                                        value={data.prix_achat}
                                                        disabled={true}
                                                    />
                                                </td>
                                            </tr>
                                        )) : <tr className='text-center'><td colSpan={6}>Aucun détail disponible </td></tr>}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton className='text-success' onClick={closeDetailModal}>
                            Fermer
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout >
    );
}