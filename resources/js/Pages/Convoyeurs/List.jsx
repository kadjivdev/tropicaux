import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cibAddthis, cilList, cilMenu, cilPencil, cilUserX } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function List({ convoyeurs }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {errors, delete: destroy } = useForm({})

    const deleteUser = (e, convoyeur) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `Le convoyeur (${convoyeur?.raison_sociale}) sera supprimé de façon permanente !`,
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
                destroy(route('convoyeur.destroy', convoyeur.id), {
                    onSuccess: () => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `Le convoyeur (${convoyeur?.raison_sociale}) a été supprimé avec succès.`,
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
                    <CIcon className='text-success' icon={cilList} /> Gestion des convoyeurs
                </h2>
            }
        >
            <Head title="Les Convoyeurs" />

            <div className="row py-12 justify-content-center">

                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('convoyeur.create') ?
                            (<div className="text-center  items-center gap-4">
                                <Link className="btn w-50 bg-success bg-hover text-white" href={route("convoyeur.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Raison Sociale</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    convoyeurs.map((convoyeur, index) => (
                                        <tr key={convoyeur.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{convoyeur?.raison_sociale ?? '---'}</td>
                                            <td>{convoyeur.phone || '---'}</td>
                                            <td>{convoyeur.email || '---'}</td>
                                            <td>{convoyeur.adresse || '---'}</td>
                                            <td>
                                                <div className="dropstart">
                                                    <button className="dropdown-toggle inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <CIcon icon={cilMenu} /> Gérer
                                                    </button>

                                                    <ul className="dropdown-menu p-2 border rounded shadow">
                                                        <li>
                                                            {checkPermission('convoyeur.edit') ?
                                                                (<Link
                                                                    className='btn'
                                                                    href={route('convoyeur.edit', convoyeur.id)}
                                                                >
                                                                    <CIcon icon={cilPencil} />  Modifier
                                                                </Link>) : null
                                                            }
                                                        </li>
                                                        <li>
                                                            {checkPermission('convoyeur.delete') ?
                                                                (<Link
                                                                    href="#"
                                                                    className='btn'
                                                                    onClick={(e) => deleteUser(e, convoyeur)}
                                                                >
                                                                    <CIcon icon={cilUserX} />  Supprimer
                                                                </Link>) : null
                                                            }
                                                        </li>
                                                    </ul>
                                                </div>
                                            </td>
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