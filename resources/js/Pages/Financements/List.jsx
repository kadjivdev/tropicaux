import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cilCheckCircle, cilCloudDownload, cilList, cilMenu, cilPencil, cilUserX } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function List({ financements }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const { patch, delete: destroy } = useForm({})

    const deleteFinancement = (e, financement) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Le financement sera supprimé de façon permanente !`,
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
                destroy(route('financement.destroy', financement.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `Le financement a été supprimé avec succès.`,
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

    const validateFinancement = (e, financement) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Ce financement sera validé de façon permanente !`,
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
                patch(route('financement.validate', financement.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">Validation réussie </span>',
                            text: `Le financement a été validé avec succès.`,
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
                    <CIcon className='text-success' icon={cilList} /> Gestion des financements
                </h2>
            }
        >
            <Head title="Les Financements" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('financement.create') ?
                            (<div className="text-center  items-center gap-4">
                                <Link className="btn w-50 bg-success bg-hover text-white" href={route("financement.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col text-center">Action</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Pré-Financement</th>
                                    <th scope="col">Fournisseur</th>
                                    <th scope="col">Montant</th>
                                    <th scope="col">Montant retourné</th>
                                    <th scope="col">Reste</th>
                                    <th scope="col">Date de financement</th>
                                    <th scope="col">Preuve</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Validé le</th>
                                    <th scope="col">Validé par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    financements.data.map((financement, index) => (
                                        <tr key={financement.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {!financement.validated_at ?
                                                    (
                                                        <div className="dropstart">
                                                            <button className="dropdown-toggle inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <CIcon icon={cilMenu} /> Gérer
                                                            </button>

                                                            <ul className="dropdown-menu p-2 border rounded shadow">
                                                                <li>
                                                                    {checkPermission('financement.edit') ?
                                                                        (<Link
                                                                            className='btn text-warning'
                                                                            href={route('financement.edit', financement.id)}
                                                                        >
                                                                            <CIcon icon={cilPencil} />  Modifier
                                                                        </Link>) : null
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {checkPermission('financement.validate') ?
                                                                        (<Link
                                                                            href="#"
                                                                            className='btn text-success'
                                                                            onClick={(e) => validateFinancement(e, financement)}
                                                                        >
                                                                            <CIcon icon={cilCheckCircle} />  Valider
                                                                        </Link>) : null
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {checkPermission('financement.delete') ?
                                                                        (<Link
                                                                            href="#"
                                                                            className='btn text-danger'
                                                                            onClick={(e) => deleteFinancement(e, financement)}
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
                                            <td><span className="badge bg-light rounded text-dark rounded shadow-sm"> {financement?.reference ?? '---'}</span> </td>
                                            <td><span className="badge bg-light rounded text-success rounded shadow-sm">{`${financement?.prefinancement?.reference}`} </span> </td>
                                            <td>{financement?.fournisseur?.raison_sociale ?? '---'}</td>
                                            <td><span className="badge bg-light border rounded text-dark">{financement.montant} FCFA</span></td>
                                            <td><span className="badge bg-light border rounded text-danger">{financement.back_amount} FCFA</span></td>
                                            <td><span className="badge bg-light border rounded text-dark">{financement.reste} FCFA</span></td>
                                            <td>{financement.date_financement}</td>
                                            <td>
                                                {financement.document ? (
                                                    <a
                                                        className='btn btn-sm shadow border rounded text-dark'
                                                        target='_blank'
                                                        href={financement.document}
                                                    >
                                                        <CIcon className='text-success' icon={cilCloudDownload} />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">---</span>
                                                )}
                                            </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${financement.createdBy?.firstname} - ${financement.createdBy?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${financement.validated_at || '--'}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${financement.validatedBy?.firstname || ''} - ${financement.validatedBy?.lastname || ''}`}</span> </td>
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