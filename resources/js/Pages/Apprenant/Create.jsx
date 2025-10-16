import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import CIcon from '@coreui/icons-react';
import { cilSend, cilArrowCircleLeft, cilLibraryAdd } from "@coreui/icons";
import Swal from 'sweetalert2';
import Select from 'react-select'

export default function Create({ parents, classes, schools, series }) {
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
        parent_id: "",
        school_id: "",
        classe_id: "",
        serie_id: "",
        firstname: "",
        lastname: "",
        adresse: "",
        email: "",
        phone: "",
        date_naissance: "",
        lieu_naissance: "",
        sexe: "",
        photo: "",
        educ_master:''
    });

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

        post(route('apprenant.store'), {
            onSuccess: () => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: 'Opération réussie',
                    text: 'Apprenant crée avec succès',
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
                    <CIcon className='text-success' icon={cilLibraryAdd} /> Panel d'ajout des apprenants
                </h2>
            }
        >
            <Head title="Ajouter école" />

            <div className="row py-12 justify-content-center">
                <div className="col-md-10 bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                    <div className="mx-auto _max-w-7xl space-y-6 sm:px-6 lg:px-8 ">

                        <div className="bg-light p-3 rounded border mb-5">
                            {checkPermission('apprenant.view') ?
                                (<div className=" text-center  items-center gap-4">
                                    <Link className="btn btn-sm bg-success bg-hover text-white" href={route("apprenant.index")}> <CIcon icon={cilArrowCircleLeft} /> Liste des apprenants</Link>
                                </div>) : null
                            }

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="parent_id" value="Parent" >  <span className="text-danger">*</span> </InputLabel>

                                            <Select
                                                placeholder="Rechercher un parent..."
                                                name="parent_id"
                                                id="parent_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={parents.map((parent) => ({
                                                    value: parent.id,
                                                    label: `${parent.lastname} - ${parent.firstname}`,
                                                }))}
                                                value={parents
                                                    .map((parent) => ({
                                                        value: parent.id,
                                                        label: `${parent.lastname} - ${parent.firstname}`,
                                                    }))
                                                    .find((option) => option.value === data.parent_id)} // set selected option
                                                onChange={(option) => setData('parent_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.parent_id} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="school_id" value="L'école concernée" >  <span className="text-danger">*</span> </InputLabel>

                                            <Select
                                                placeholder="Rechercher une école ..."
                                                name="school_id"
                                                id="school_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={schools.map((school) => ({
                                                    value: school.id,
                                                    label: `${school.raison_sociale}`,
                                                }))}
                                                value={schools
                                                    .map((school) => ({
                                                        value: school.id,
                                                        label: `${school.raison_sociale}`,
                                                    }))
                                                    .find((option) => option.value === data.school_id)} // set selected option
                                                onChange={(option) => setData('school_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.school_id} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="classe_id" value="Classe concernée" >  <span className="text-danger">*</span> </InputLabel>

                                            <Select
                                                placeholder="Rechercher une classe ..."
                                                name="school_id"
                                                id="school_id"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={classes.map((classe) => ({
                                                    value: classe.id,
                                                    label: `${classe.libelle}`,
                                                }))}
                                                value={classes
                                                    .map((classe) => ({
                                                        value: classe.id,
                                                        label: `${classe.libelle}`,
                                                    }))
                                                    .find((option) => option.value === data.classe_id)} // set selected option
                                                onChange={(option) => setData('classe_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.classe_id} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="serie_id" value="Série concernée" >  </InputLabel>

                                            <Select
                                                placeholder="Rechercher une série ..."
                                                name="serie_id"
                                                id="serie_id"
                                                // required
                                                className="form-control mt-1 block w-full"
                                                options={series.map((serie) => ({
                                                    value: serie.id,
                                                    label: `${serie.libelle}`,
                                                }))}
                                                value={series
                                                    .map((serie) => ({
                                                        value: serie.id,
                                                        label: `${serie.libelle}`,
                                                    }))
                                                    .find((option) => option.value === data.serie_id)} // set selected option
                                                onChange={(option) => setData('serie_id', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.serie_id} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="firstname" value="Nom" ><span className="text-danger">*</span></InputLabel>

                                            <TextInput
                                                id="firstname"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.firstname}
                                                required
                                                placeholder="John"
                                                onChange={(e) => setData('firstname', e.target.value)}
                                                autoComplete="firstname"
                                            />

                                            <InputError className="mt-2" message={errors.firstname} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="date_naissance" value="Date de naissance" />

                                            <TextInput
                                                id="date_naissance"
                                                type="date"
                                                className="mt-1 block w-full"
                                                placeholder="01/03/2025"
                                                // required
                                                value={data.date_naissance}
                                                onChange={(e) => setData('date_naissance', e.target.value)}
                                                autoComplete="date_naissance"
                                            />

                                            <InputError className="mt-2" message={errors.date_naissance} />
                                        </div>

                                    </div>
                                    <div className="col-md-6">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="lastname" value="Prénom" > <span className="text-danger">*</span></InputLabel>
                                            <TextInput
                                                id="lastname"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="Do"
                                                value={data.lastname}
                                                onChange={(e) => setData('lastname', e.target.value)}
                                                required
                                                autoComplete="lastname"
                                            />

                                            <InputError className="mt-2" message={errors.lastname} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="adresse" value="Adresse" > <span className="text-danger">*</span></InputLabel>
                                            <TextInput
                                                id="adresse"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="Cotonou | Apkapka"
                                                value={data.adresse}
                                                onChange={(e) => setData('adresse', e.target.value)}
                                                required
                                                autoComplete="adresse"
                                            />

                                            <InputError className="mt-2" message={errors.adresse} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="email" value="Email" ></InputLabel>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                placeholder="jpe@gmail.com"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                // required
                                                autoComplete="email"
                                            />

                                            <InputError className="mt-2" message={errors.email} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="phone" value="Telephone" ></InputLabel>
                                            <TextInput
                                                id="phone"
                                                type="text"
                                                className="mt-1 block w-full"
                                                placeholder="+22956854397"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                // required
                                                autoComplete="phone"
                                            />

                                            <InputError className="mt-2" message={errors.phone} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="sexe" value="Le sexe" ><span className="text-danger">*</span></InputLabel>

                                            <Select
                                                placeholder="Rechercher un sexe ..."
                                                name="sexe"
                                                id="sexe"
                                                required
                                                className="form-control mt-1 block w-full"
                                                options={[
                                                    { value: 'Masculin', label: 'Masculin' },
                                                    { value: 'Féminin', label: 'Féminin' },
                                                ]}
                                                value={[
                                                    { value: 'Masculin', label: 'Masculin' },
                                                    { value: 'Féminin', label: 'Féminin' },
                                                ].map((sexe) => ({
                                                    value: sexe.value,
                                                    label: `${sexe.label}`,
                                                }))
                                                    .find((option) => option.value === data.sexe)} // set selected option
                                                onChange={(option) => setData('sexe', option.value)} // update state with id
                                            />

                                            <InputError className="mt-2" message={errors.sexe} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="lieu_naissance" value="Lieu de naissance" ></InputLabel>

                                            <TextInput
                                                id="lieu_naissance"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.lieu_naissance}
                                                placeholder="Cotonou | Apkapka"
                                                // required
                                                onChange={(e) => setData('lieu_naissance', e.target.value)}
                                                autoComplete="lieu_naissance"
                                            />

                                            <InputError className="mt-2" message={errors.lieu_naissance} />
                                        </div>

                                        <div className='mb-3'>
                                            <InputLabel htmlFor="educ_master" value="N° EducMaster" ></InputLabel>

                                            <TextInput
                                                id="educ_master"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.educ_master}
                                                placeholder="##65TU7656"
                                                // required
                                                onChange={(e) => setData('educ_master', e.target.value)}
                                                autoComplete="educ_master"
                                            />

                                            <InputError className="mt-2" message={errors.educ_master} />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className='mb-3'>
                                            <InputLabel htmlFor="photo" value="Photo de l'apprenant" ></InputLabel>

                                            <TextInput
                                                id="photo"
                                                type="file"
                                                className="mt-1 block w-full"
                                                // required
                                                onChange={(e) => setData('photo', e.target.files[0])}
                                                autoComplete="photo"
                                            />

                                            {progress && (
                                                <progress value={progress.percentage} max="100">
                                                    {progress.percentage}%
                                                </progress>
                                            )}

                                            <InputError className="mt-2" message={errors.photo} />
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
