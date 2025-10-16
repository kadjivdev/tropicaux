import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilInfo, cilLibraryAdd, cilList, cilSend } from "@coreui/icons";
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function List({ apprenants }) {
    const permissions = usePage().props.auth.permissions;
    const [showModal, setShowModal] = useState(false)

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const showImg = (apprenant) => {
        Swal.fire({
            // title: `${inscription.apprenant?.firstname} - ${inscription.apprenant?.lastname}`,
            text: `Profile de : ${apprenant.parent?.firstname} - ${apprenant.parent?.lastname}`,
            imageUrl: apprenant.photo,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Photo de profil",
            confirmButtonColor: '#1b5a38',
            confirmButtonText: "Merci"
        });

    }


    const confirmShowModal = (e) => {
        e.preventDefault();
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    };

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

        post(route('apprenant.import'), {
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
                    <CIcon className='text-success' icon={cilList} /> Panel des listes d'apprenants
                </h2>
            }
        >
            <Head title="Les apprenants" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 " style={{ overflowX: 'auto' }} >

                        {checkPermission('apprenant.create') ?
                            (<div className="  items-center gap-4">
                                <Link className="mx-2 btn btn-sm bg-success bg-hover text-white" href={route("apprenant.create")}> <CIcon className='' icon={cilLibraryAdd} /> Ajouter</Link>

                                <button className="btn btn-sm bg-success bg-hover text-white"
                                    onClick={(e) => confirmShowModal(e)}> <CIcon className='' icon={cilCloudDownload} /> Importer des apprenants</button>
                            </div>) : null
                        }
                        <table className="table table-striped" id='myTable' style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th scope="col">N°</th>
                                    <th scope="col">Photo</th>
                                    <th scope="col">Ecole</th>
                                    <th scope="col">Nom</th>
                                    <th scope="col">Prénom</th>
                                    <th scope="col">Parent</th>
                                    <th scope="col">Classe</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Adresse</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Sexe</th>
                                    <th scope="col">Date de naissance</th>
                                    <th scope="col">Lieu de naissance</th>
                                    <th scope="col">N° Educ Master</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    apprenants.data.map((apprenant, index) => (
                                        <tr key={apprenant.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                {apprenant.photo ?
                                                    (<img src={apprenant.photo}
                                                        onClick={() => showImg(apprenant)}
                                                        className='img-fluid img-circle shadow' srcSet=""
                                                        style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'solid 5px #f6f6f6', cursor: 'pointer' }} />) : '---'
                                                }
                                            </td>
                                            <td><span className="badge bg-light border text-dark border">{apprenant.school?.raison_sociale}</span></td>
                                            <td>{apprenant.firstname}</td>
                                            <td>{apprenant.lastname}</td>
                                            <td>{apprenant.parent?.firstname} {apprenant.parent?.lastname}</td>
                                            <td>{apprenant.classe?.libelle || '--'} - {apprenant.serie?.libelle || '--'} </td>
                                            <td>{apprenant.email || '--'}</td>
                                            <td>{apprenant.adresse || '--'}</td>
                                            <td>{apprenant.phone || '--'}</td>
                                            <td>{apprenant.sexe || '--'}</td>
                                            <td><span className="badge bg-light border rounded text-dark">{apprenant.date_naissance || '--'}</span></td>
                                            <td><span className="badge bg-light border rounded text-dark">{apprenant.lieu_naissance || '--'}</span></td>
                                            <td><span className="badge bg-light border rounded text-dark">{apprenant.educ_master || '--'}</span></td>
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
                        Importation de nouveaux <em className='text-success'>apprenants</em>
                    </h2>

                    <p className="alert alert-success">
                        <CIcon className='text-success' icon={cilInfo} />
                        <ul className="">
                            <li className="">Télecharger le modèle</li>
                            <li className="">Remplissez le modèle</li>
                            <li className="">Uploader le fichier remplit</li>
                        </ul>
                    </p>

                    <div className="my-2">
                        <a
                            target="_blank"
                            href="/apprenants-model.xlsx"
                            className="w-100 text-white btn btn-sm bg-success btn-hover"
                        >
                            <CIcon icon={cilCloudDownload} />
                            Télécharger le modèle
                        </a>
                    </div>


                    <div className="my-2">
                        <InputLabel htmlFor="apprenants" value="Les apprenants en fichier excel" > <span className="text-danger">*</span>  </InputLabel>
                        <TextInput
                            type="file"
                            name="apprenants"
                            id="apprenants"
                            required
                            className='form-control mt-1 block w-full'
                            onChange={(e) => setData('apprenants', e.target.files[0])}
                        />

                        <InputError className="mt-2" message={errors.apprenants} />
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
