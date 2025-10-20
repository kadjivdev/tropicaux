import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cibMyspace, cilList } from "@coreui/icons";
import Swal from 'sweetalert2';


export default function Update({ fournisseur }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        patch,
        processing,
    } = useForm({
        raison_sociale: fournisseur.raison_sociale || "",
        phone: fournisseur.phone || "",
        email: fournisseur.email || "",
        adresse: fournisseur.adresse || "",
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('fournisseur.update', fournisseur.id), {
            onStart: () => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Modification en cours ...</span>', // yellow text
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
                    title: '<span style="color: #2a7348;">👌 Opération réussie </span>', // yellow text
                    text: 'Fournisseur crée avec succès',
                    confirmButtonText: '😇 Fermer'
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #facc15;">🤦‍♂️ Opération échouée </span>', // yellow text
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                    confirmButtonText: '😇 Fermer'
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cibMyspace} /> Modification des fournisseurs locaux
                </h2>
            }
        >
            <Head title="Modifier un fournisseur" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('fournisseur.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("fournisseur.index")}> <CIcon icon={cilList} /> Liste des fournisseurs</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="raison_sociale" value="Raison sociale(nom & prénom)" > <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="raison_sociale"
                                                className="mt-1 block w-full"
                                                value={data.raison_sociale}
                                                placeholder="Ex: Emmanuel EDAH"
                                                onChange={(e) => setData('raison_sociale', e.target.value)}
                                                autoComplete="raison_sociale"
                                                required
                                            />

                                            <InputError className="mt-2" message={errors.raison_sociale} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="phone" value="Numéro de téléphone" ></InputLabel>
                                            <TextInput
                                                id="phone"
                                                className="mt-1 block w-full"
                                                value={data.phone}
                                                placeholder="Ex: +2290156854397"
                                                onChange={(e) => setData('phone', e.target.value)}
                                                autoComplete="phone"
                                            />

                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="email" value="Email" > </InputLabel>
                                            <TextInput
                                                id="email"
                                                className="mt-1 block w-full"
                                                value={data.email}
                                                placeholder="Ex: emmanuel@gmail.com"
                                                onChange={(e) => setData('email', e.target.value)}
                                                autoComplete="email"
                                            />

                                            <InputError className="mt-2" message={errors.email} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="adresse" value="Adresse"> </InputLabel>
                                            <TextInput
                                                id="adresse"
                                                className="mt-1 block w-full"
                                                value={data.adresse}
                                                placeholder="Ex: Cotonou, Bénin"
                                                onChange={(e) => setData('adresse', e.target.value)}
                                                autoComplete="adresse"
                                            />

                                            <InputError className="mt-2" message={errors.adresse} />
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
