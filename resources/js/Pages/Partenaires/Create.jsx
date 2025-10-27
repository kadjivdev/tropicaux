import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilList, cibAddthis } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function Create({ }) {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        post,
        processing,
        progress
    } = useForm({
        raison_sociale: "",
        phone: "",
        adresse: "",
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('partenaire.store'), {
            onStart: () => {
                Swal.fire({
                    title: '<span style="color: #facc15;">🫠 Opération en cours...</span>', // yellow text
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
                    title: '<span style="color: #2a7348;">👌Opération réussie </span>',
                    text: 'Opération réussie',
                    confirmButtonText: '😇 Fermer'
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    title: '<span style="color: #facc15;">🤦‍♂️ Opération échouée </span>', // yellow text
                    text: `${e.error ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                    confirmButtonText: '😇 Fermer'
                });
                console.log(e);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cibAddthis} /> Ajout des partenaires
                </h2>
            }
        >
            <Head title="Ajouter un partenaire" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('partenaire.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("partenaire.index")}> <CIcon icon={cilList} /> Liste des partenaires</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="raison_sociale" value="Raison Sociale" >  <span className="text-danger">*</span> </InputLabel>
                                            <TextInput
                                                id="raison_sociale"
                                                className="mt-1 block w-full"
                                                value={data.raison_sociale}
                                                placeholder="Ex: Kocou Emmanuel"
                                                onChange={(e) => setData('raison_sociale', e.target.value)}
                                                autoComplete="raison_sociale"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.raison_sociale} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="phone" value="Téléphone" > </InputLabel>
                                            <TextInput
                                                id="phone"
                                                className="mt-1 block w-full"
                                                value={data.phone}
                                                placeholder="Ex: +2290156854397"
                                                onChange={(e) => setData('phone', e.target.value)}
                                                autoComplete="phone"
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="adresse" value="Adresse" > </InputLabel>
                                            <TextInput
                                                id="adresse"
                                                className="mt-1 block w-full"
                                                value={data.adresse}
                                                placeholder="Ex: Cotonou"
                                                onChange={(e) => setData('adresse', e.target.value)}
                                                autoComplete="adresse"
                                            />

                                            <InputError className="mt-2" message={errors.adresse} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="email" value="Email" > </InputLabel>
                                            <TextInput
                                                id="email"
                                                className="mt-1 block w-full"
                                                value={data.email}
                                                placeholder="Ex: gogochristian009@gmail.com"
                                                onChange={(e) => setData('email', e.target.value)}
                                                autoComplete="email"
                                            />

                                            <InputError className="mt-2" message={errors.email} />
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
