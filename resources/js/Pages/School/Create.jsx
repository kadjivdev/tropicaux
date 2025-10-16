import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilArrowCircleLeft, cilLibraryAdd } from "@coreui/icons";
import Swal from 'sweetalert2';

export default function Create() {
    const permissions = usePage().props.auth.permissions;

    const checkPermission = (name) => {
        return permissions.some(per => per.name == name);
    }

    const {
        data,
        setData,
        errors,
        put,
        post,
        reset,
        processing,
        progress
    } = useForm({
        raison_sociale: "",
        adresse: "",
        email: "",
        phone: "",
        logo: "",
        ifu: "",
        rccm: "",
        slogan: "",
        description: ""
    });

    const submit = (e) => {
        // alert("gogog")
        e.preventDefault();

        Swal.fire({
            title: 'Opération en cours...',
            text: 'Veuillez patienter pendant que nous traitons vos données.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        post(route('school.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Ecole crée avec succès',
                });
            },
            onError: (e) => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Opération échouée',
                    text: `${e.exception ?? 'Veuillez vérifier vos informations et réessayer.'}`,
                });
                console.log(e);
            },
            // onFinish: () => reset('password'),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    <CIcon className='text-success' icon={cilLibraryAdd} /> Panel d'ajout des écoles
                </h2>
            }
        >
            <Head title="Ajouter école" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('ecole.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("school.index")}> <CIcon icon={cilArrowCircleLeft} /> Liste des écoles</Link>
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
                                                value={data.lastname}
                                                placeholder="COMPLEXE SCOLAIRE BILINGUE"
                                                onChange={(e) => setData('raison_sociale', e.target.value)}
                                                required
                                                isFocused
                                                autoComplete="raison_sociale"
                                            />

                                            <InputError className="mt-2" message={errors.raison_sociale} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="adresse" value="Adresse" > </InputLabel>
                                            <TextInput
                                                id="adresse"
                                                className="mt-1 block w-full"
                                                value={data.adresse}
                                                placeholder="Cotonou | Rue 234"
                                                onChange={(e) => setData('adresse', e.target.value)}
                                                autoComplete="adresse"
                                            />

                                            <InputError className="mt-2" message={errors.adresse} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="ifu" value="IFU" />

                                            <TextInput
                                                id="ifu"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="###RTYU87654"
                                                value={data.ifu}
                                                onChange={(e) => setData('ifu', e.target.value)}
                                                autoComplete="ifu"
                                            />

                                            <InputError className="mt-2" message={errors.ifu} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="slogan" value="Slogan" ><span className="text-danger">*</span></InputLabel>

                                            <TextInput
                                                id="rccm"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.slogan}
                                                required
                                                placeholder="Discipline - Travail - Succès"
                                                onChange={(e) => setData('slogan', e.target.value)}
                                                autoComplete="slogan"
                                            />

                                            <InputError className="mt-2" message={errors.slogan} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="email" value="Email" > <span className="text-danger">*</span></InputLabel>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                placeholder="school@gmail.com"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                autoComplete="username"
                                            />

                                            <InputError className="mt-2" message={errors.email} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="phone" value="Telephone" ><span className="text-danger">*</span></InputLabel>
                                            <TextInput
                                                id="phone"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="+22956854397"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                required
                                                autoComplete="phone"
                                            />

                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="rccm" value="RCCM" />

                                            <TextInput
                                                id="rccm"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="###98765FG"
                                                value={data.rccm}
                                                onChange={(e) => setData('rccm', e.target.value)}
                                                autoComplete="rccm"
                                            />

                                            <InputError className="mt-2" message={errors.rccm} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="description" value="Description" ><span className="text-danger">*</span></InputLabel>

                                            <TextInput
                                                id="rccm"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.description}
                                                placeholder="Enseignement Maternel et Primaire"
                                                required
                                                onChange={(e) => setData('description', e.target.value)}
                                                autoComplete="description"
                                            />

                                            <InputError className="mt-2" message={errors.description} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className='mb-3'>
                                        <InputLabel htmlFor="description" value="Logo de l'école" ><span className="text-danger">*</span></InputLabel>

                                        <TextInput
                                            id="description"
                                            type="file"
                                            className="mt-1 block w-full"
                                            required
                                            onChange={(e) => setData('logo', e.target.files[0])}
                                            autoComplete="logo"
                                        />

                                        {progress && (
                                            <progress value={progress.percentage} max="100">
                                                {progress.percentage}%
                                            </progress>
                                        )}

                                        <InputError className="mt-2" message={errors.logo} />
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
