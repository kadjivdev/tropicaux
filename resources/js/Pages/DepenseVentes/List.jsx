import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cilCheckCircle, cilCloudDownload, cilList, cilMenu, cilPencil, cilUserX } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function List({ depenses }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const { patch, delete: destroy } = useForm({})

    const deleteDepense = (e, depense) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Le depense (${depense.reference}) sera supprimée de façon permanente !`,
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
                destroy(route('depense-vente.destroy', depense.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `La depense a été supprimée avec succès.`,
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

    const validatedDepense = (e, depense) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `La depense (${depense.reference}) sera validé de façon permanente !`,
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
                patch(route('depense-vente.validate', depense.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">Validation réussie </span>',
                            text: `La depense (${depense.reference}) a été validée avec succès.`,
                            confirmButtonText: '😇 Fermer'
                        });
                    },
                    onError: (e) => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #facc15;">🤦‍♂️ Validation échouée </span>', // yellow text
                            text: `${e.error ?? 'Veuillez réessayer.'}`,
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
                    <CIcon className='text-success' icon={cilList} /> Gestion des depenses ventes
                </h2>
            }
        >
            <Head title="Les depenses ventes" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('vente.create') ?
                            (<div className="text-center  items-center gap-4">
                                <Link className="btn w-50 bg-success bg-hover text-white" href={route("depense-vente.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr> 
                                    <th scope="col">N°</th>
                                    <th scope="col text-center">Action</th>
                                    <th scope="col">Reference</th>
                                    <th scope="col">Vente</th>
                                    <th scope="col">Montant</th>
                                    <th scope="col">Preuve</th>
                                    <th scope="col">Observation</th>
                                    <th scope="col">Inséré par</th>
                                    <th scope="col">Validé le</th>
                                    <th scope="col">Validé par</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    depenses.data.map((depense, index) => (
                                        <tr key={depense.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {!depense.validated_at ?
                                                    (
                                                        <div className="dropstart">
                                                            <button className="dropdown-toggle inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <CIcon icon={cilMenu} /> Gérer
                                                            </button>

                                                            <ul className="dropdown-menu p-2 border rounded shadow">
                                                                <li>
                                                                    {checkPermission('vente.edit') ?
                                                                        (<Link
                                                                            className='btn text-warning'
                                                                            href={route('depense-vente.edit', depense.id)}
                                                                        >
                                                                            <CIcon icon={cilPencil} />  Modifier
                                                                        </Link>) : null
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {checkPermission('vente.validate') ?
                                                                        (<Link
                                                                            href="#"
                                                                            className='btn text-success'
                                                                            onClick={(e) => validatedDepense(e, depense)}
                                                                        >
                                                                            <CIcon icon={cilCheckCircle} />  Valider
                                                                        </Link>) : null
                                                                    }
                                                                </li>
                                                                <li>
                                                                    {checkPermission('vente.delete') ?
                                                                        (<Link
                                                                            href="#"
                                                                            className='btn text-danger'
                                                                            onClick={(e) => deleteDepense(e, depense)}
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
                                            <td><span className="badge bg-light rounded text-dark rounded shadow-sm"> {depense.reference ?? '---'}</span> </td>
                                            <td><span className="badge bg-light rounded text-dark rounded shadow-sm"> {depense.vente?.reference ?? '---'}</span> </td>
                                            <td>{depense.montant}</td>
                                            <td>
                                                {depense.document ? (
                                                    <a
                                                        className='btn btn-sm shadow border rounded text-dark'
                                                        target='_blank'
                                                        href={depense.document}
                                                    >
                                                        <CIcon className='text-success' icon={cilCloudDownload} />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">---</span>
                                                )}
                                            </td>
                                            <td> <textarea rows={1} className='form-control' readOnly={true} placeholder={depense.commentaire || '---'}></textarea> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${depense.createdBy?.firstname} - ${depense.createdBy?.lastname}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${depense.validated_at || '--'}`}</span> </td>
                                            <td> <span className="badge bg-light border rounded text-dark">{`${depense.validatedBy?.firstname || ''} - ${depense.validatedBy?.lastname || ''}`}</span> </td>
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