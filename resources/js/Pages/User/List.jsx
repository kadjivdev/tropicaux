import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import CIcon from '@coreui/icons-react';
import Swal from 'sweetalert2';
import { cilUserX, cilList, cilLink, cilInfo, cilSend, cilPencil, cilMenu, cibAddthis, cilZoomIn } from "@coreui/icons";
import Modal from '@/Components/Modal';
import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function List({ users, roles }) {
    const authUser = usePage().props.auth.user;

    const permissions = usePage().props.auth.permissions;
    const [currentUser, setCurrentUser] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    useEffect(() => (
        setData("user_id", currentUser?.id)
    ), [currentUser]);

    const confirmShowModal = (e, user) => {
        e.preventDefault();
        setShowModal(true);

        setCurrentUser(user)
    };
    const closeModal = () => {
        setShowModal(false);
    };

    const showUserProfile = (user) => {
        Swal.fire({
            text: `Profile de : ${user.firstname} - ${user.lastname}`,
            imageUrl: user.detail?.profile_img,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Photo de profile",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Merci"
        });
    }

    const [formatedRoles, setFormatedRoles] = useState(roles.map((role) => ({
        'id': role.id,
        'name': role.name,
        'checked': false
    })))

    const { data, errors, setData, processing, post } = useForm({
        role_id: '',
        user_id: currentUser?.id,
    })

    useEffect(() => {
        const selectedRole = formatedRoles.find(role => role.checked);
        setData("role_id", selectedRole ? selectedRole.id : null);
    }, [formatedRoles]);

    /**
     * DataTable hundle
     */

    const selectRole = (role) => {
        const newRoles = formatedRoles.map(r => ({
            ...r,
            checked: r.id === role.id  // ✅ seul le rôle cliqué devient true
        }));
        setFormatedRoles(newRoles);
    };

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: '<span style="color: #facc15;">🫠 Affectation de rôle en cours...</span>', // yellow text
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('affect.role'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    // icon: 'success',
                    title: '<span style="color: #2a7348;">👌Opération réussie </span>',
                    text: `Rôle affecté au user (${currentUser?.firstname} - ${currentUser?.lastname}) avec succès`,
                    confirmButtonText: '😇 Fermer'
                });
                setShowModal(false)
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #facc15;">🤦‍♂️ Opération échouée </span>', // yellow text
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                    confirmButtonText: '😇 Fermer'
                });
                setShowModal(false);
            },
        });
    };

    const deleteUser = (e, user) => {
        e.preventDefault();
        Swal.fire({
            title: '<span style="color: #facc15;">⚠️ Êtes-vous sûr ?</span>', // yellow text
            text: `L'utilisateur (${user.firstname} - ${user.lastname}) sera supprimé de façon permanente !`,
            // icon: 'warning',
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
                axios.post(route('user.destroy', user.id), {
                    _method: 'DELETE',
                })
                    .then(() => {
                        Swal.close();
                        Swal.fire({
                            // icon: 'success',
                            title: '<span style="color: #2a7348;">👌Suppression réussie </span>',
                            text: `L'utilisateur (${user.firstname} - ${user.lastname}) a été supprimé avec succès.`,
                            confirmButtonText: '😇 Fermer'
                        });

                    })
                    .catch((error) => {
                        Swal.close();
                        Swal.fire({
                            title: '<span style="color: #facc15;">🤦‍♂️ Suppression échouée </span>', // yellow text
                            text: `Erreur lors de la suppression : ${error.response?.data?.message ?? 'Veuillez réessayer.'}`,
                            confirmButtonText: '😇 Fermer'
                        });
                        console.error("There was an error!", error);
                    });
            }
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des utilisateurs
                </h2>
            }
        >
            <Head title="Les Utilisateurs" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('utilisateur.create') ?
                            (<div className="text-center items-center gap-4">
                                <Link className="btn w-50 bg-success bg-hover text-white" href={route("user.create")}> <CIcon className='' icon={cibAddthis} /> Ajouter</Link>
                            </div>) : null
                        }

                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Profile</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Rôles</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.data.map((user, index) => (
                                        <tr key={user.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                <button
                                                    className='btn btn-sm btn-light border bg-hover shadow-sm'
                                                    onClick={() => showUserProfile(user)}
                                                >
                                                    <CIcon icon={cilZoomIn} />
                                                </button>
                                            </td>
                                            <td>{user.firstname}</td>
                                            <td>{user.lastname}</td>
                                            <td>{user.email || '---'}</td>
                                            <td>{user.detail?.phone || '---'}</td>
                                            <td className='text-center'>
                                                {
                                                    user.roles?.length > 0 ?
                                                        user.roles.map((role, index) => (
                                                            <span key={index} className="m-1  bg-light text-dark border rounded">{role.name}</span>
                                                        )) : '---'
                                                }
                                            </td>
                                            <td>
                                                <div className="dropstart">
                                                    <button className="dropdown-toggle inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <CIcon icon={cilMenu} /> Gérer
                                                    </button>

                                                    <ul className="dropdown-menu p-2 border rounded shadow">
                                                        <li>
                                                            {checkPermission('role.assign') && authUser.id != user.id ?
                                                                (<Link
                                                                    href='#'
                                                                    className='btn'
                                                                    onClick={(e) => confirmShowModal(e, user)}
                                                                >
                                                                    <CIcon icon={cilLink} /> Affecter rôle
                                                                </Link>) : null
                                                            }
                                                        </li>
                                                        <li>
                                                            {checkPermission('utilisateur.edit') ?
                                                                (<Link
                                                                    className='btn'
                                                                    href={route('user.edit', user.id)}
                                                                >
                                                                    <CIcon icon={cilPencil} />  Modifier
                                                                </Link>) : null
                                                            }
                                                        </li>
                                                        <li>
                                                            {checkPermission('utilisateur.delete') ?
                                                                (<Link
                                                                    href="#"
                                                                    className='btn'
                                                                    onClick={(e) => deleteUser(e, user)}
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

            {/* Modal d'affcetation */}
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Affectation de rôle à <em className='text-success'>{currentUser?.firstname} -  {currentUser?.lastname} </em>
                    </h2>

                    <p className="alert alert-warning">
                        <CIcon className='text-danger' icon={cilInfo} /> En affectant un rôle à un utilisateur, tous les autres utilisateurs disposant de ce rôle vont tous le perdre
                    </p>

                    {/*  */}
                    <table className="shadow-sm table table-striped" id='myTable' style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th scope="col">N°</th>
                                <th scope="col">Libele</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                formatedRoles.length > 0 ?
                                    formatedRoles.map((role, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td ><span className="badge bg-light rounded border text-dark">{role.name}</span></td>
                                            <td>
                                                <Checkbox
                                                    checked={role.checked}          // ⚡ important : bind à role.checked
                                                    onChange={() => selectRole(role)}
                                                />
                                            </td>
                                        </tr>
                                    )) : (<tr><td colSpan={3} className='text-danger'>Aucun rôle!</td> </tr>)
                            }
                        </tbody>
                    </table>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Abandonner
                        </SecondaryButton>

                        <PrimaryButton disabled={processing}>
                            <CIcon icon={cilSend} /> {processing ? 'Enregistrement ...' : 'Enregistrer les modifications'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
