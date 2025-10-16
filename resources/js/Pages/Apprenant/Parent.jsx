import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import Swal from 'sweetalert2';
import { cilCenterFocus, cilList, cilInfo, cilSend, cilCloudDownload } from "@coreui/icons";
import Modal from '@/Components/Modal';
import { useEffect, useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Link } from 'react-admin';


export default function List({ users }) {
    const authUser = usePage().props.auth.user;

    const permissions = usePage().props.auth.permissions;
    const [showModal, setShowModal] = useState(false)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const confirmShowModal = (e) => {
        e.preventDefault();
        setShowModal(true);
    }

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

    const { data, setData, errors, processing, post } = useForm({
        parents: '',
    })

    const submit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('parent.import'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: `Importation effectuée avec succès`,
                });
                setShowModal(false)
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                });
                setShowModal(false)
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilList} /> Panel des parents
                </h2>
            }
        >
            <Head title="Les Parents" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >
                        {checkPermission('utilisateur.create') ?
                            (<div className="items-center gap-4">
                                <button className="btn btn-sm bg-success bg-hover text-white"
                                    onClick={(e) => confirmShowModal(e)}> <CIcon className='' icon={cilCloudDownload} /> Importer des parents</button>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Profile</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Email/Phone</th>
                                    <th scope="col">Rôles</th>
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
                                                    <CIcon icon={cilCenterFocus} />
                                                </button>
                                            </td>
                                            <td>{user.school?.raison_sociale || '---'}</td>
                                            <td>{user.firstname}</td>
                                            <td>{user.lastname}</td>
                                            <td>{user.email}/{user.detail?.phone || '---'}</td>
                                            <td className='text-center'>
                                                {
                                                    user.roles?.length > 0 ?
                                                        user.roles.map((role, index) => (
                                                            <span key={index} className="m-1 badge bg-light text-dark border rounded">{role.name}</span>
                                                        )) : '---'
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/*  */}
            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Importation de nouveaux  <em className='text-success'> parents </em>
                    </h2>

                    <p className="alert alert-success">
                        <CIcon className='text-success' icon={cilInfo} />
                        <ol className="">
                            <li className="">Télecharger le modèle</li>
                            <li className="">Remplissez le modèle</li>
                            <li className="">Uploader le fichier remplit</li>
                        </ol>
                    </p>

                    <div className="my-2">
                        <a
                            target="_blank"
                            href="/parents-model.xlsx"
                            className="w-100 text-white btn btn-sm bg-success btn-hover"
                        >
                            <CIcon icon={cilCloudDownload} />
                            Télécharger le modèle
                        </a>
                    </div>


                    <div className="my-2">
                        <InputLabel htmlFor="parents" value="Les parents en fichier excel" > <span className="text-danger">*</span>  </InputLabel>
                        <TextInput
                            type="file"
                            name="parents"
                            id="parents"
                            required
                            className='form-control mt-1 block w-full'
                            onChange={(e) => setData('parents', e.target.files[0])}
                        />

                        <InputError className="mt-2" message={errors.parents} />
                    </div>

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
