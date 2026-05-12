import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilCloudDownload, cilList, cilMenu, cilNoteAdd, cilPencil, cilUserX, } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function Requetes({ requetes }) {
    const permissions = usePage().props.auth.permissions;

    console.log("Les requetes : ", requetes.data)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const { patch, delete: destroy } = useForm({})

    // validation des requetes
    const validateRequete = (e, requete) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `La requete sera validée de façon permanente !`,
            showCancelButton: true,
            confirmButtonColor: '#2a7348',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '😇 Oui, valider !',
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
                patch(route('requete_fournisseur.validate', { requete_fournisseur: requete.id }), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">Validation réussie </span>',
                            text: `La requete fournisseur a été validée avec succès.`,
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

    // suppression des requetes
    const deleteRequete = (e, requete) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `La requete sera supprimée de façon permanente !`,
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
                destroy(route('requete_fournisseur.destroy', { requete_fournisseur: requete.id }), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `Le pré-financement a été supprimé avec succès.`,
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Gestion des requetes fournisseurs
                </h2>
            }
        >
            <Head title="Les Requetes" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        <div className="text-center  items-center gap-4">
                            <Link className="btn w-50 bg-success bg-hover text-white" href={route("requete_fournisseur.create")}> <CIcon className='' icon={cilNoteAdd} /> Ajouter une requete</Link>
                        </div>

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope='col'>Action</th>
                                    <th scope="col">Numéro</th>
                                    <th scope="col">Fournisseur</th>
                                    <th scope="col">Montant</th>
                                    <th scope="col">Preuve</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Inséré le</th>
                                    <th scope="col">Validé par</th>
                                    <th scope="col">Validé le</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    requetes.data && requetes.data?.map((requete, index) => (
                                        <tr key={requete.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {!requete.validatedAt ?
                                                    (
                                                        <div className="dropstart">
                                                            <button className="dropdown-toggle inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <CIcon icon={cilMenu} /> Gérer
                                                            </button>

                                                            <ul className="dropdown-menu p-2 border rounded shadow">
                                                                <li>
                                                                    {checkPermission('fournisseur.edit') ?
                                                                        (<Link
                                                                            className='btn text-warning'
                                                                            href={route('requete_fournisseur.edit', requete.id)}
                                                                        >
                                                                            <CIcon icon={cilPencil} />  Modifier
                                                                        </Link>) : null
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {checkPermission('fournisseur.validate') ?
                                                                        (<Link
                                                                            href="#"
                                                                            className='btn text-success'
                                                                            onClick={(e) => validateRequete(e, requete)}
                                                                        >
                                                                            <CIcon icon={cilCheckCircle} />  Valider
                                                                        </Link>) : null
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {checkPermission('fournisseur.delete') ?
                                                                        (<Link
                                                                            href="#"
                                                                            className='btn text-danger'
                                                                            onClick={(e) => deleteRequete(e, requete)}
                                                                        >
                                                                            <CIcon icon={cilUserX} />  Supprimer
                                                                        </Link>) : null
                                                                    }
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    ) : '---'
                                                }
                                            </td>
                                            <td><span className="badge bg-light rounded text-dark rounded shadow-sm"> {requete?.numero ?? '---'}</span> </td>
                                            <td> <span className="badge bg-light shadow rounded border text-success">{requete?.fournisseur?.raison_sociale ?? '---'}</span></td>
                                            <td> <span className="badge bg-light shadow rounded border text-success"> {requete.montant}</span></td>
                                            <td> <span className="badge bg-light shadow rounded border text-success">  {requete.preuve ? <a href={requete.preuve} target='__blank'><CIcon icon={cilCloudDownload} /></a> : '---'}</span></td>

                                            <td> <span className="badge bg-light border rounded text-dark">{`${requete.createdBy?.firstname} - ${requete.createdBy?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{requete.createdAt || '---'}</span> </td>

                                            <td> <span className="badge bg-light border rounded text-dark">{`${requete.validatedBy?.firstname || ''} - ${requete.validatedBy?.lastname || ''}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{requete.validatedAt || '---'}</span> </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}