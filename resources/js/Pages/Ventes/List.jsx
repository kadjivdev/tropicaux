import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cilCheckCircle, cilCloudDownload, cilList, cilMenu, cilPencil, cilTruck, cilUserX } from "@coreui/icons";
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Textarea } from '@headlessui/react';
import Select from 'react-select';

export default function List({ ventes, chargements }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const allVentes = ventes.data;
    const [_ventes, setVentes] = useState(ventes.data);
    const [currentVente, setCurrentVente] = useState(null);

    const [showCamions, setShowCamions] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const showCamionsModal = (e, vente) => {
        e.preventDefault();
        setCurrentVente(vente);
        setShowCamions(true);
    }

    const closeCamionModal = () => {
        setShowCamions(false);
    }

    const showDetailsModeModal = (e, vente) => {
        console.log("Current vente ", vente)
        e.preventDefault();
        setCurrentVente(vente);
        setShowDetails(true);
    }

    const closeDetailModal = () => {
        setShowDetails(false);
    }

    const {data, patch, delete: destroy } = useForm({})


    const [totalMontant, setTotalMontant] = useState(0);

    useEffect(() => {
        const montant = _ventes.reduce((acc, vente) => {
            console.log("La vente en cours :", vente);
            return acc + parseAmount(vente.montant); // On ajoute 0 si "reste" est undefined ou null
        }, 0);

        setTotalMontant(montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 }));
    })

    const deleteVente = (e, vente) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `La vente (${vente.reference}) sera supprimée de façon permanente !`,
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
                destroy(route('vente.destroy', vente.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `La vente a été supprimée avec succès.`,
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

    const validateVente = (e, vente) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `La vente (${vente.reference}) sera validée de façon permanente !`,
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
                patch(route('vente.validate', vente.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">Validation réussie </span>',
                            text: `La vente (${vente.reference}) a été validée avec succès.`,
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

    // Function to clean and convert the formatted string to a valid number
    const parseAmount = (amount) => {
        if (typeof amount === 'string') {
            // Remove spaces (thousands separator) and replace comma with dot for decimals
            return parseFloat(amount.replace(/\s/g, '').replace(',', '.')) || 0;
        }
        return 0;
    };

    // Filtrage
    const handleFiltre = (option) => {
        let newVentes = allVentes.filter((v) => v.chargement?.id == option.value)
        setVentes(newVentes)
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Gestion des ventes
                </h2>
            }
        >
            <Head title="Les Ventes" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('vente.create') ?
                            (<div className="text-center  items-center gap-4">
                                <Link className="btn w-50 bg-success bg-hover text-white" href={route("vente.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }

                        {/* filtrage via gestionnaire */}
                        <div className="row d-flex justify-content-center">
                            <div className="col-6">
                                <Select
                                    placeholder="Rechercher un Chargement ..."
                                    className="form-control mt-1 block w-full"
                                    options={chargements.map((c) => ({
                                        value: c.id,
                                        label: `${c.reference}`,
                                    }))}
                                    value={chargements
                                        .map((c) => ({
                                            value: c.id,
                                            label: `${c.reference}`,
                                        }))
                                        .find((option) => option.value === data.id)} // set selected option
                                    onChange={(option) => handleFiltre(option)} // update state with id
                                />
                            </div>
                        </div>

                        <div className="border">
                            <strong className='border'>Total ventes: </strong>     <span className="badge mx-3 bg-dark text-light shadow border rounded">{totalMontant} FCFA</span> <br />
                        </div>

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Chargement</th>
                                    <th scope="col">Partenaire</th>
                                    <th scope="col">Camions</th>
                                    <th scope="col">Mode paiements</th>
                                    <th scope="col">Prix</th>
                                    <th scope="col">Poids</th>
                                    <th scope="col">Nbre Sac rejete</th>
                                    <th scope="col">Prix unit Sac rejete</th>
                                    <th scope='col'>Montant</th>
                                    <th scope='col'>Montant Total</th>
                                    <th scope='col'>Commentaire</th>
                                    <th scope='col'>Preuve</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Validé le</th>
                                    <th scope="col">Validé par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    _ventes.map((vente, index) => (
                                        <tr key={vente.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {!vente.validated_at ?
                                                    (
                                                        <div className="dropstart">
                                                            <button className="dropdown-toggle inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <CIcon icon={cilMenu} /> Gérer
                                                            </button>

                                                            <ul className="dropdown-menu p-2 border rounded shadow">
                                                                <li>
                                                                    {checkPermission('vente.edit') && (
                                                                        <Link
                                                                            className="btn text-warning"
                                                                            href={route('vente.edit', vente.id)} // ✅ navigation via Inertia
                                                                        >
                                                                            <CIcon icon={cilPencil} /> Modifier
                                                                        </Link>
                                                                    )}
                                                                </li>

                                                                <li>
                                                                    {checkPermission('vente.validate') && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn text-success"
                                                                            onClick={(e) => validateVente(e, vente)} // ✅ action Inertia
                                                                        >
                                                                            <CIcon icon={cilCheckCircle} /> Valider
                                                                        </button>
                                                                    )}
                                                                </li>

                                                                <li>
                                                                    {checkPermission('vente.delete') && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn text-danger"
                                                                            onClick={(e) => deleteVente(e, vente)} // ✅ action Inertia
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
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.reference} </span></td>
                                            <td> <span className="badge bg-light border rounded text-success"> {vente.chargement?.reference} </span></td>
                                            <td>{vente?.partenaire?.raison_sociale ?? '---'}</td>
                                            <td>
                                                <button
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                    onClick={(e) => showCamionsModal(e, vente)}
                                                >
                                                    <CIcon icon={cilTruck} />
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className='btn btn-sm btn-light border shadow-sm rounded text-success'
                                                    href="#"
                                                    onClick={(e) => showDetailsModeModal(e, vente)}
                                                >
                                                    <CIcon icon={cilList} />
                                                </button>
                                            </td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.prix || '00'} </span></td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.poids || '00'} </span></td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.nbre_sac_rejete || '00'} </span></td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.prix_unitaire_sac_rejete || '00'} </span></td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.montant || '00'} </span></td>
                                            <td> <span className="badge bg-light border rounded text-dark"> {vente.montant_total || '00'} </span></td>
                                            <td><textarea rows={1} className='form-control' disabled={true} placeholder={vente.commentaire || '--'}></textarea></td>
                                            <td>
                                                {vente.document ? (
                                                    <a
                                                        className='btn btn-sm shadow border rounded text-dark'
                                                        target='_blank'
                                                        href={vente.document}
                                                    >
                                                        <CIcon className='text-success' icon={cilCloudDownload} />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">---</span>
                                                )}
                                            </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${vente.createdBy?.firstname} - ${vente.createdBy?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${vente.validated_at || '--'}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${vente.validatedBy?.firstname || ''} - ${vente.validatedBy?.lastname || ''}`}</span> </td>
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
                        <CIcon className='text-success' icon={cilTruck} /> Liste des camions de la vente <span className='badge bg-light rounded border shadow-sm text-success'>{currentVente?.reference ?? '---'}</span>
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
                                    currentVente?.camions.length > 0 ?
                                        currentVente?.camions.map((data, index) => (
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
                                                        disabled={true}
                                                        rows={1}
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

            {/* Model des  modes */}
            <Modal show={showDetails} onClose={closeDetailModal}>
                <form className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        <CIcon className='text-success' icon={cilList} /> Mode de paiement de la vente <span className='badge bg-light rounded border shadow-sm text-success'>{currentVente?.reference ?? '---'}</span>
                    </h2>

                    <div className="p-2">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Mode de paiement</th>
                                </tr>
                            </thead>
                            <tbody id="lignes">
                                {
                                    currentVente?.modes.length > 0 ?
                                        currentVente?.modes.map((data, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <TextInput
                                                        type="text"
                                                        className="mt-1 block w-full"
                                                        value={data.mode?.libelle}
                                                        disabled={true}
                                                    />
                                                </td>
                                            </tr>
                                        )) : <tr className='text-center'><td colSpan={2}>Aucun détail disponible </td></tr>}
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
        </AuthenticatedLayout>
    );
}